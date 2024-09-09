import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import {
  getUpcomingSessions,
  getPastSessions,
  cancelSession,
} from "../controllers/sessionController.js";

const sessionRoutes = express.Router();

// http://localhost:4000/app/calendar/upcoming-sessions
sessionRoutes.get("/upcoming-sessions", verifyToken, getUpcomingSessions);

// http://localhost:4000/app/calendar/past-sessions
sessionRoutes.get("/past-sessions", verifyToken, getPastSessions);

sessionRoutes.delete('/cancel-session/:id', verifyToken, cancelSession);

export default sessionRoutes;
