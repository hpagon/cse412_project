const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all courses with location info
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, l.campus, l.building, l.roomnumber
      FROM Course c
      LEFT JOIN FoundIn_Course fc ON c.courseid = fc.courseid
      LEFT JOIN Location l ON fc.locationid = l.locationid
      ORDER BY c.coursename
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single course with details
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // Course info with location
    const courseResult = await pool.query(
      `
      SELECT c.*, l.campus, l.building, l.roomnumber
      FROM Course c
      LEFT JOIN FoundIn_Course fc ON c.courseid = fc.courseid
      LEFT JOIN Location l ON fc.locationid = l.locationid
      WHERE c.courseid = $1
    `,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Get professors teaching this course
    const professorsResult = await pool.query(
      `
      SELECT p.asuid, p.firstname, p.lastname, pr.rank
      FROM Teaches t
      JOIN People p ON t.asuid = p.asuid
      JOIN Professors pr ON t.asuid = pr.asuid
      WHERE t.courseid = $1
    `,
      [courseId]
    );

    // Get enrolled students count
    const enrollmentResult = await pool.query(
      `
      SELECT COUNT(*) as enrolled
      FROM Attends_Course
      WHERE courseid = $1
    `,
      [courseId]
    );

    res.json({
      ...courseResult.rows[0],
      professors: professorsResult.rows,
      enrolledCount: parseInt(enrollmentResult.rows[0].enrolled),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses for a student
router.get("/student/:asuid", async (req, res) => {
  try {
    const { asuid } = req.params;
    const result = await pool.query(
      `
      SELECT c.*, l.campus, l.building, l.roomnumber
      FROM Attends_Course ac
      JOIN Course c ON ac.courseid = c.courseid
      LEFT JOIN FoundIn_Course fc ON c.courseid = fc.courseid
      LEFT JOIN Location l ON fc.locationid = l.locationid
      WHERE ac.asuid = $1
      ORDER BY c.coursename
    `,
      [asuid]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses taught by a professor
router.get("/professor/:asuid", async (req, res) => {
  try {
    const { asuid } = req.params;
    const result = await pool.query(
      `
      SELECT c.*, l.campus, l.building, l.roomnumber,
        (SELECT COUNT(*) FROM Attends_Course ac WHERE ac.courseid = c.courseid) as enrolled_count
      FROM Teaches t
      JOIN Course c ON t.courseid = c.courseid
      LEFT JOIN FoundIn_Course fc ON c.courseid = fc.courseid
      LEFT JOIN Location l ON fc.locationid = l.locationid
      WHERE t.asuid = $1
      ORDER BY c.coursename
    `,
      [asuid]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student enrolls in a course
router.post("/enroll", async (req, res) => {
  try {
    const { asuid, courseId } = req.body;

    // Check if already enrolled
    const existing = await pool.query(
      "SELECT * FROM Attends_Course WHERE asuid = $1 AND courseid = $2",
      [asuid, courseId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    await pool.query(
      "INSERT INTO Attends_Course (asuid, courseid) VALUES ($1, $2)",
      [asuid, courseId]
    );

    res.json({ message: "Successfully enrolled in course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student drops a course
router.delete("/drop", async (req, res) => {
  try {
    const { asuid, courseId } = req.body;

    const result = await pool.query(
      "DELETE FROM Attends_Course WHERE asuid = $1 AND courseid = $2",
      [asuid, courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.json({ message: "Successfully dropped course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Professor signs up to teach a course
router.post("/teach", async (req, res) => {
  try {
    const { asuid, courseId } = req.body;

    // Check if already teaching
    const existing = await pool.query(
      "SELECT * FROM Teaches WHERE asuid = $1 AND courseid = $2",
      [asuid, courseId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Already teaching this course" });
    }

    await pool.query("INSERT INTO Teaches (asuid, courseid) VALUES ($1, $2)", [
      asuid,
      courseId,
    ]);

    res.json({ message: "Successfully signed up to teach course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Professor stops teaching a course
router.delete("/unteach", async (req, res) => {
  try {
    const { asuid, courseId } = req.body;

    const result = await pool.query(
      "DELETE FROM Teaches WHERE asuid = $1 AND courseid = $2",
      [asuid, courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Teaching assignment not found" });
    }

    res.json({ message: "Successfully removed from teaching course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
