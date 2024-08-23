// index.ts
// Main entry point for the application

// Imports ==============================================
// import dotenv from "dotenv";   // change the dev script in package,json to:
// dotenv.config();               // "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\" ",
import "./jobs/revertExpiredBookings.js"; // Import the cron job
import app from "./app.js";
import db from "./db.js";
import { PORT } from "./utils/config.js";

// Server ===============================================

const startServer = async () => {
  const port = PORT;
  try {
    await db.connect();
    app.listen(port, () =>
      console.log(`🌐 Server is running on port ${port} (index.ts)`)
    );
  } catch (error) {
    console.log("❌ Could not start server (index.ts)", error);
  }
};

startServer(); // npm run dev
