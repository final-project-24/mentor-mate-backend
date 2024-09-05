import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import {
  createStripePaymentIntentHandler, 
} from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

// Route for creating a Stripe Payment Intent
paymentRoutes.post(
  "/stripe/create-payment-intent",
  verifyToken,
  createStripePaymentIntentHandler
);

export default paymentRoutes;

