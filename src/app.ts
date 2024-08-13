// app.ts
// Adds middleware and imports the appRouter

// Imports =========================================

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookie from "cookie-parser";
import { logMiddleware } from "./middleware/logMiddleware.js";
import { dbMiddleware } from "./middleware/dbMiddleware.js";
import { COOKIE_SECRET, FRONTEND_URL } from "./utils/config.js";
import appRouter from "./routes/appRouter.js";

// App =============================================

const app = express();

// Middleware --------------------------------------

// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookie(COOKIE_SECRET)); // The cookie-parser middleware parses cookies attached to the client request object

// app.use(cors()); // Allow all origins
app.use(
  cors({
    origin: FRONTEND_URL, // Allow the frontend to access this server
    credentials: true, // Allow cookies to be sent from the frontend to the server
  })
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the 'public' directory

app.use(logMiddleware); // HTTP request logger custom middleware with additional info - remove for production

app.use(dbMiddleware); // // Change database: Call the connect function based on the db name extracted from the request headers to connect to the appropriate database

// Main Route Handler -------------------------------

app.use("/app", appRouter);

// Exports =========================================

export default app;
