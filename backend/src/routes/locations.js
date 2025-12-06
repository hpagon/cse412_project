const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all locations
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM Location ORDER BY campus, building, roomnumber
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get locations by campus
router.get("/campus/:campus", async (req, res) => {
  try {
    const { campus } = req.params;
    const result = await pool.query(
      `
      SELECT * FROM Location WHERE campus = $1 ORDER BY building, roomnumber
    `,
      [campus]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single location
router.get("/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await pool.query(
      "SELECT * FROM Location WHERE locationid = $1",
      [locationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
