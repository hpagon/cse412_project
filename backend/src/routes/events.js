const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all events with location and club info
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, l.campus, l.building, l.roomnumber, c.name as clubname, c.clubid
      FROM Event e
      LEFT JOIN FoundIn_Event fe ON e.eventid = fe.eventid
      LEFT JOIN Location l ON fe.locationid = l.locationid
      LEFT JOIN Host h ON e.eventid = h.eventid
      LEFT JOIN Clubs c ON h.clubid = c.clubid
      ORDER BY e.date, e.starttime
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming events
router.get("/upcoming", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, l.campus, l.building, l.roomnumber, c.name as clubname, c.clubid
      FROM Event e
      LEFT JOIN FoundIn_Event fe ON e.eventid = fe.eventid
      LEFT JOIN Location l ON fe.locationid = l.locationid
      LEFT JOIN Host h ON e.eventid = h.eventid
      LEFT JOIN Clubs c ON h.clubid = c.clubid
      WHERE e.date >= CURRENT_DATE
      ORDER BY e.date, e.starttime
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await pool.query(
      `
      SELECT e.*, l.campus, l.building, l.roomnumber, c.name as clubname, c.clubid
      FROM Event e
      LEFT JOIN FoundIn_Event fe ON e.eventid = fe.eventid
      LEFT JOIN Location l ON fe.locationid = l.locationid
      LEFT JOIN Host h ON e.eventid = h.eventid
      LEFT JOIN Clubs c ON h.clubid = c.clubid
      WHERE e.eventid = $1
    `,
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events for clubs a student is in
router.get("/student/:asuid", async (req, res) => {
  try {
    const { asuid } = req.params;
    const result = await pool.query(
      `
      SELECT e.*, l.campus, l.building, l.roomnumber, c.name as clubname, c.clubid
      FROM Attends_Club ac
      JOIN Host h ON ac.clubid = h.clubid
      JOIN Event e ON h.eventid = e.eventid
      LEFT JOIN FoundIn_Event fe ON e.eventid = fe.eventid
      LEFT JOIN Location l ON fe.locationid = l.locationid
      JOIN Clubs c ON h.clubid = c.clubid
      WHERE ac.asuid = $1 AND e.date >= CURRENT_DATE
      ORDER BY e.date, e.starttime
    `,
      [asuid]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events for a specific club
router.get("/club/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    const result = await pool.query(
      `
      SELECT e.*, l.campus, l.building, l.roomnumber
      FROM Host h
      JOIN Event e ON h.eventid = e.eventid
      LEFT JOIN FoundIn_Event fe ON e.eventid = fe.eventid
      LEFT JOIN Location l ON fe.locationid = l.locationid
      WHERE h.clubid = $1
      ORDER BY e.date, e.starttime
    `,
      [clubId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new event for a club (must be a club member)
router.post("/", async (req, res) => {
  try {
    const { asuid, clubId, date, startTime, endTime, locationId } = req.body;

    // Verify user is a member of the club
    const memberCheck = await pool.query(
      "SELECT * FROM Attends_Club WHERE asuid = $1 AND clubid = $2",
      [asuid, clubId]
    );

    if (memberCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You must be a club member to create events" });
    }

    // Create event
    const eventResult = await pool.query(
      "INSERT INTO Event (date, starttime, endtime) VALUES ($1, $2, $3) RETURNING *",
      [date, startTime, endTime]
    );

    const event = eventResult.rows[0];

    // Link to club
    await pool.query("INSERT INTO Host (clubid, eventid) VALUES ($1, $2)", [
      clubId,
      event.eventid,
    ]);

    // Link to location if provided
    if (locationId) {
      await pool.query(
        "INSERT INTO FoundIn_Event (eventid, locationid) VALUES ($1, $2)",
        [event.eventid, locationId]
      );
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an event (must be a member of the hosting club)
router.put("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { asuid, date, startTime, endTime } = req.body;

    // Get the club that hosts this event
    const hostCheck = await pool.query(
      "SELECT clubid FROM Host WHERE eventid = $1",
      [eventId]
    );

    if (hostCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Verify user is a member of the hosting club
    const memberCheck = await pool.query(
      "SELECT * FROM Attends_Club WHERE asuid = $1 AND clubid = $2",
      [asuid, hostCheck.rows[0].clubid]
    );

    if (memberCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You must be a club member to update events" });
    }

    const result = await pool.query(
      "UPDATE Event SET date = $1, starttime = $2, endtime = $3 WHERE eventid = $4 RETURNING *",
      [date, startTime, endTime, eventId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event (must be a member of the hosting club)
router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { asuid } = req.body;

    // Get the club that hosts this event
    const hostCheck = await pool.query(
      "SELECT clubid FROM Host WHERE eventid = $1",
      [eventId]
    );

    if (hostCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Verify user is a member of the hosting club
    const memberCheck = await pool.query(
      "SELECT * FROM Attends_Club WHERE asuid = $1 AND clubid = $2",
      [asuid, hostCheck.rows[0].clubid]
    );

    if (memberCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You must be a club member to delete events" });
    }

    const result = await pool.query("DELETE FROM Event WHERE eventid = $1", [
      eventId,
    ]);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
