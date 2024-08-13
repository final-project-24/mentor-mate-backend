// db.ts
// Connect to MongoDB with Mongoose

// Imports ==============================================
// import * as dotenv from "dotenv";   // change the dev script in package,json to:
// dotenv.config();                    // "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\" ",
import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV, DEFAULT_DB_NAME, PROD_DB_NAME } from "./utils/config.js";

// =============================================================================================
// Dynamic Database URI => Uncomment this block and comment the previous block to use this approach
// =============================================================================================

// // Determine URI function =======================================

// // Function to dynamically determine the database URI based on the request headers
// const getDatabaseUri = (req = { headers: {} }) => {
//   // console.log("🔎 Request headers:", req.headers);
//   const dbName = req.headers["x-database-name"]; // Extract the dbName from the request headers
//   // console.log("🔎 x-database-name:", dbName);
//   let baseUri = MONGODB_URI; // Default base URI
//   // console.log("🔎 Base URI:", baseUri);
//   const defaultDbName = DEFAULT_DB_NAME; // Default db name
//   if (dbName) {
//     const finalUri = `${baseUri}${dbName}`; // Use the dbName from the request headers if available
//     // console.log("🔎 Final URI with dbName:", finalUri);
//     return { uri: finalUri, dbName }; // Return the final URI and dbName
//   }
//   const defaultUri = `${baseUri}${defaultDbName}`; // Use the default db name if no dbName is provided
//   // console.log("🔎 Default URI:", defaultUri);
//   return { uri: defaultUri, dbName: defaultDbName }; // Return the default URI and dbName
// };

// // Connect function =======================================

// // Outside the connect function, declare a variable to store the current database name
// let currentDbName = "";

// const connect = async (req = { headers: {} }) => {
//   const { uri: mongoDbUri, dbName } = getDatabaseUri(req);
//   if (!mongoDbUri) {
//     console.error("❌ Database URI is not defined (src/db.ts)");
//     return;
//   }

//   // First condition: Check if there is no running connection and start a new connection
//   if (mongoose.connection.readyState === 0) {
//     try {
//       await mongoose.connect(mongoDbUri);
//       console.log(`🌐 Successfully connected to MongoDB database: ${dbName} (src/db.ts)`);
//       currentDbName = dbName; // Update the current database name
//       return; // Exit after establishing a new connection
//     } catch (error) {
//       console.error("❌ Error connecting to MongoDB:", error, "(src/db.ts)");
//     }
//   }

//   // Second condition: Check if the requested database is the same as the current one
//   if (dbName === currentDbName) {
//     console.log(
//       `🔄 Reusing existing connection to MongoDB database: ${dbName} (src/db.ts)`
//     );
//     return; // Return early as there's no need to reconnect
//   }

//   // Third condition: If the requested database is different from the current one
//   try {
//     await mongoose.connection.close();
//     console.log(`🔌 Closing existing connection to database: ${currentDbName} (src/db.ts)`);
//     await mongoose.connect(mongoDbUri);
//     console.log(`🌐 Successfully connected to MongoDB database: ${dbName} (src/db.ts)`);
//     currentDbName = dbName; // Update the current database name
//   } catch (error) {
//     console.error("❌ Error connecting to MongoDB:", error, "(src/db.ts)");
//   }
// };

// // Close function =======================================

// const close = async () => {
//   try {
//     await mongoose.connection.close();
//     console.log("✅ Successfully disconnected from MongoDB");
//   } catch (error) {
//     console.error("❌ Error disconnecting from MongoDB:", error);
//     // Handle the error appropriately
//     // Don't necessarily need to exit the process here
//   }
// };

// =============================================================================================
// Static Database URI => Uncomment this block and comment the next block to use this approach
// =============================================================================================

// Determine the database name based on the environment
const dbName = NODE_ENV === "production" ? PROD_DB_NAME : DEFAULT_DB_NAME;
const mongoDbUri = `${MONGODB_URI}${dbName}`;

if (!mongoDbUri) {
  console.error("❌ MONGODB_URI environment variable is not defined");
  process.exit(1);
}

const connect = async () => {
  try {
    await mongoose.connect(mongoDbUri);
    console.log(`🌐 Successfully connected to MongoDB database: ${dbName} (db.ts)`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // Exit or implement a reconnection strategy
  }
};

const close = async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ Successfully disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
    // Handle the error appropriately
    // Don't necessarily need to exit the process here
  }
};

// =============================================================================================
// Dynamic Database URI => Uncomment this block and comment the previous block to use this approach
// =============================================================================================

// Exports =============================================

export default { connect, close };
