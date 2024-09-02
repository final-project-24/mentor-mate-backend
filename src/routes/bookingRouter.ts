import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import { getBookingDetails } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

// http://localhost:4000/app/booking/booking-details/:id
bookingRoutes.get("/booking-details/:id", getBookingDetails);

export default bookingRoutes;


