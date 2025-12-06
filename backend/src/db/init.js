const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function initializeDatabase() {
  try {
    // Read the schema
    const schemaPath = path.join(__dirname, "../../db/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("Initializing database...");

    // Execute the schema
    await pool.query(schema);

    console.log("Database schema created successfully!");
    console.log("Tables created:");
    console.log("  - People");
    console.log("  - Students");
    console.log("  - Professors");
    console.log("  - Course");
    console.log("  - Teaches");
    console.log("  - Attends_Course");
    console.log("  - Location");
    console.log("  - FoundIn_Course");
    console.log("  - Clubs");
    console.log("  - Attends_Club");
    console.log("  - Event");
    console.log("  - Host");
    console.log("  - FoundIn_Event");
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase();
