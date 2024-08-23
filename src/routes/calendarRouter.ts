import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import {
  getMentorAvailability,
  addCalendarEvent,
  bookCalendarEvent,
} from "../controllers/calendarController.js";

const calendarRoutes = express.Router();

// http://localhost:4000/app/calendar/:mentorUuid
calendarRoutes.get("/:mentorUuid", verifyToken, getMentorAvailability);

// http://localhost:4000/app/calendar/
calendarRoutes.post("/", verifyToken, addCalendarEvent);

// http://localhost:4000/app/calendar/book/:id
calendarRoutes.post("/book/:id", verifyToken, bookCalendarEvent);

export default calendarRoutes;
