import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import {
  getMentorAvailability,
  addCalendarEvent,
  bookCalendarEvent,
  getBookingDetails,
  deleteCalendarEvent,
  // getUpcomingSessions,
  // getPastSessions,
} from "../controllers/calendarController.js";

const calendarRoutes = express.Router();

// // http://localhost:4000/app/calendar/upcoming-sessions
// calendarRoutes.get("/upcoming-sessions", verifyToken, getUpcomingSessions);

// // http://localhost:4000/app/calendar/past-sessions
// calendarRoutes.get("/past-sessions", verifyToken, getPastSessions);

// http://localhost:4000/app/calendar/:id
calendarRoutes.delete("/:id", verifyToken, deleteCalendarEvent);

// http://localhost:4000/app/calendar/:mentorUuid
calendarRoutes.get("/:mentorUuid", verifyToken, getMentorAvailability);

// http://localhost:4000/app/calendar/
calendarRoutes.post("/", verifyToken, addCalendarEvent);

// http://localhost:4000/app/calendar/book/:id
calendarRoutes.post("/book/:id", verifyToken, bookCalendarEvent);

// http://localhost:4000/app/calendar/booking-details/:id
calendarRoutes.get("/booking-details/:id", getBookingDetails);

export default calendarRoutes;
