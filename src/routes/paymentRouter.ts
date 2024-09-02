import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import {
  //   createPaymentIntentHandler,
  //   paymentStatusUpdateHandler,
  createStripePaymentIntentHandler,
} from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

// paymentRoutes.post('/create-payment-intent', createPaymentIntentHandler);
// paymentRoutes.post('/update-payment-status', paymentStatusUpdateHandler);

// Route for creating a Stripe Payment Intent
paymentRoutes.post(
  "/stripe/create-payment-intent",
  verifyToken,
  createStripePaymentIntentHandler
);

// Route for creating a PayPal Payment
// paymentRoutes.post("/paypal/create-payment", createPayPalPaymentHandler);

export default paymentRoutes;