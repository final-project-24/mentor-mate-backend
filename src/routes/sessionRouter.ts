import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import {
  getUpcomingSessions,
  getPastSessions,
  cancelSession,
  // confirmFreeSlotBooking // Import the new function
} from "../controllers/sessionController.js";

const sessionRoutes = express.Router();

// http://localhost:4000/app/calendar/upcoming-sessions
sessionRoutes.get("/upcoming-sessions", verifyToken, getUpcomingSessions);

// http://localhost:4000/app/calendar/past-sessions
sessionRoutes.get("/past-sessions", verifyToken, getPastSessions);

// http://localhost:4000/app/session/cancel-session/:id
sessionRoutes.delete('/cancel-session/:id', verifyToken, cancelSession);

// http://localhost:4000/app/session/confirm-free-slot
// sessionRoutes.post('/confirm-free-slot', verifyToken, confirmFreeSlotBooking);

export default sessionRoutes;

