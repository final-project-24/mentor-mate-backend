// testController.ts

// Imports =========================================

import testModel from "../models/testModel.js";

// Controller ======================================

// getServer -----------------------------------

export const getServer = async (req, res) => {
  console.log("🔎 getServer called");
  return res.send("✅ Your server is working fine!");
};

// getCollection -----------------------------------

export const getCollection = async (req, res) => {
  console.log("🔎 getDataBase called");
  try {
    const data = await testModel.find(); // Fetch all documents
    console.log("🔎 Fetched data:", data);
    return res.json(data); // Send the fetched data as JSON
  } catch (error) {
    console.log("❌ Error in getDataBase:", error);
    return res
      .status(500)
      .json({ message: "❌ Error fetching data", error: error.message });
  }
};

// postCollection -----------------------------------

export const postCollection = async (req, res) => {
  console.log("🔎 createData called");
  try {
    const data = req.body; // Extract the data from the request body
    console.log("🔎 Creating data:", data);
    const result = await testModel.create(data); // Create a new document
    console.log("✅ Data created:", result);
    return res.json(result); // Send the created document as JSON
  } catch (error) {
    console.log("❌ Error in createData:", error);
    return res
      .status(500)
      .json({ message: "❌ Error creating data", error: error.message });
  }
};
