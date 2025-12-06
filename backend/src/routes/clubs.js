const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM Clubs ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single club with details
router.get("/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;

    const clubResult = await pool.query(
      "SELECT * FROM Clubs WHERE clubid = $1",
      [clubId]
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Get members
    const membersResult = await pool.query(
      `
      SELECT p.asuid, p.firstname, p.lastname
      FROM Attends_Club ac
      JOIN People p ON ac.asuid = p.asuid
      WHERE ac.clubid = $1
    `,
      [clubId]
    );

    // Get upcoming events
    const eventsResult = await pool.query(
      `
      SELECT e.*, l.campus, l.building, l.roomnumber
      FROM Host h
      JOIN Event e ON h.eventid = e.eventid
      LEFT JOIN FoundIn_Event fe ON e.eventid = fe.eventid
      LEFT JOIN Location l ON fe.locationid = l.locationid
      WHERE h.clubid = $1 AND e.date >= CURRENT_DATE
      ORDER BY e.date, e.starttime
    `,
      [clubId]
    );

    res.json({
      ...clubResult.rows[0],
      members: membersResult.rows,
      events: eventsResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get clubs for a student
router.get("/student/:asuid", async (req, res) => {
  try {
    const { asuid } = req.params;
    const result = await pool.query(
      `
      SELECT c.*
      FROM Attends_Club ac
      JOIN Clubs c ON ac.clubid = c.clubid
      WHERE ac.asuid = $1
      ORDER BY c.name
    `,
      [asuid]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student joins a club
router.post("/join", async (req, res) => {
  try {
    const { asuid, clubId } = req.body;

    // Check if already a member
    const existing = await pool.query(
      "SELECT * FROM Attends_Club WHERE asuid = $1 AND clubid = $2",
      [asuid, clubId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Already a member of this club" });
    }

    // Add member
    await pool.query(
      "INSERT INTO Attends_Club (asuid, clubid) VALUES ($1, $2)",
      [asuid, clubId]
    );

    // Update member count
    await pool.query(
      "UPDATE Clubs SET membercount = membercount + 1 WHERE clubid = $1",
      [clubId]
    );

    res.json({ message: "Successfully joined club" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student leaves a club
router.delete("/leave", async (req, res) => {
  try {
    const { asuid, clubId } = req.body;

    const result = await pool.query(
      "DELETE FROM Attends_Club WHERE asuid = $1 AND clubid = $2",
      [asuid, clubId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Membership not found" });
    }

    // Update member count
    await pool.query(
      "UPDATE Clubs SET membercount = membercount - 1 WHERE clubid = $1",
      [clubId]
    );

    res.json({ message: "Successfully left club" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new club
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      "INSERT INTO Clubs (name, description, membercount) VALUES ($1, $2, 0) RETURNING *",
      [name, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a club (must be a member)
router.put("/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    const { asuid, name, description } = req.body;

    // Verify user is a member of the club
    const memberCheck = await pool.query(
      "SELECT * FROM Attends_Club WHERE asuid = $1 AND clubid = $2",
      [asuid, clubId]
    );

    if (memberCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You must be a club member to update club info" });
    }

    const result = await pool.query(
      "UPDATE Clubs SET name = $1, description = $2 WHERE clubid = $3 RETURNING *",
      [name, description, clubId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
