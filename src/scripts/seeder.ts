// seeder.ts
// Seeder script to insert test data into the database

// Imports ==============================================
import testModel from "../models/testModel.js";
import db from "../db.js";

// Test data ============================================

const testData = [
  { textField: "Connection 1", numberField: 100 },
  { textField: "Connection 2", numberField: 200 },
  { textField: "Connection 3", numberField: 300 },
];

// Insert test data ====================================

const insertTestData = async () => {
  try {
    console.log("✅ Connecting to database...");
    await db.connect(); // Ensure the database is connected
    console.log("✅ Connected to database, deleting existing data...");
    await testModel.deleteMany(); // Optional: Clear the collection before inserting test data
    console.log("✅ Existing data deleted, inserting new test data...");
    await testModel.insertMany(testData); // Insert the test data
    console.log("✅ Test data inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting test data:", error);
  } finally {
    console.log("✅ Closing database connection...");
    await db.close(); // Ensure the database connection is closed
    console.log("✅ Database connection closed.");
  }
};

insertTestData(); // npm run seeder
