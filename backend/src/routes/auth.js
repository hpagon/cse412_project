const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Login - returns user info and role (student/professor)
router.post("/login", async (req, res) => {
  try {
    const { asuriteUserID, password } = req.body;

    // Find person by asurite
    const personResult = await pool.query(
      "SELECT * FROM People WHERE asuriteUserID = $1 AND password = $2",
      [asuriteUserID, password]
    );

    if (personResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const person = personResult.rows[0];

    // Check if student
    const studentResult = await pool.query(
      "SELECT * FROM Students WHERE ASUID = $1",
      [person.asuid]
    );

    if (studentResult.rows.length > 0) {
      return res.json({
        ...person,
        ...studentResult.rows[0],
        role: "student",
      });
    }

    // Check if professor
    const professorResult = await pool.query(
      "SELECT * FROM Professors WHERE ASUID = $1",
      [person.asuid]
    );

    if (professorResult.rows.length > 0) {
      return res.json({
        ...person,
        ...professorResult.rows[0],
        role: "professor",
      });
    }

    // Person exists but not student or professor
    res.json({ ...person, role: "unknown" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile by ASUID
router.get("/profile/:asuid", async (req, res) => {
  try {
    const { asuid } = req.params;

    const personResult = await pool.query(
      "SELECT * FROM People WHERE ASUID = $1",
      [asuid]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const person = personResult.rows[0];

    // Check student
    const studentResult = await pool.query(
      "SELECT * FROM Students WHERE ASUID = $1",
      [asuid]
    );

    if (studentResult.rows.length > 0) {
      return res.json({
        ...person,
        ...studentResult.rows[0],
        role: "student",
      });
    }

    // Check professor
    const professorResult = await pool.query(
      "SELECT * FROM Professors WHERE ASUID = $1",
      [asuid]
    );

    if (professorResult.rows.length > 0) {
      return res.json({
        ...person,
        ...professorResult.rows[0],
        role: "professor",
      });
    }

    res.json({ ...person, role: "unknown" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
