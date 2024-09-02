// import Payment from '../models/paymentModel.js';
// import Stripe from 'stripe';
// import axios from 'axios';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const PAYMENT_STATUS = {
//   PENDING: 'pending',
//   SUCCESS: 'success',
//   FAILED: 'failed',
// };

// // Stripe Payment Intent Handler
// export const createPaymentIntentHandler = async (req, res) => {
//   const { amount, currency = 'usd', userId, isMentee } = req.body;

//   if (!amount || !currency || !userId || typeof isMentee !== 'boolean') {
//     return res.status(400).send('Amount, currency, userId, and isMentee are required.');
//   }

//   try {
//     if (!isMentee) {
//       return res.status(400).send('User must be a mentee to make a payment.');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//     });

//     const payment = new Payment({
//       amount,
//       currency,
//       paymentIntentId: paymentIntent.id,
//       status: PAYMENT_STATUS.PENDING,
//       userId,
//       isMentee,
//     });

//     await payment.save();

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     res.status(500).send('Server error. Please try again later.');
//   }
// };

// ================================================

// // PayPal Payment Handler
// export const createPayPalPaymentHandler = async (req, res) => {
//   const { amount, currency = 'usd', userId, isMentee, paypalPaymentId } = req.body;

//   if (!amount || !currency || !userId || typeof isMentee !== 'boolean' || !paypalPaymentId) {
//     return res.status(400).send('Amount, currency, userId, isMentee, and paypalPaymentId are required.');
//   }

//   try {
//     if (!isMentee) {
//       return res.status(400).send('User must be a mentee to make a payment.');
//     }

//     // Validate the payment with PayPal
//     const response = await axios.get(`https://api.paypal.com/v1/payments/payment/${paypalPaymentId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`, // Use a valid access token
//       },
//     });

//     if (response.data.state !== 'approved') {
//       return res.status(400).send('PayPal payment not approved.');
//     }

//     const payment = new Payment({
//       amount,
//       currency,
//       paymentIntentId: paypalPaymentId, // Store PayPal payment ID
//       status: PAYMENT_STATUS.PENDING,
//       userId,
//       isMentee,
//     });

//     await payment.save();

//     res.json({ success: true });
//   } catch (error) {
//     console.error('Error processing PayPal payment:', error);
//     res.status(500).send('Server error. Please try again later.');
//   }
// };

// // Payment Status Update Handler
// export const paymentStatusUpdateHandler = async (req, res) => {
//   const { paymentIntentId, status } = req.body;

//   if (!paymentIntentId || !status || !Object.values(PAYMENT_STATUS).includes(status)) {
//     return res.status(400).send('Valid paymentIntentId and status are required.');
//   }

//   try {
//     const updatedPayment = await Payment.findOneAndUpdate(
//       { paymentIntentId },
//       { status },
//       { new: true }
//     );

//     if (!updatedPayment) {
//       return res.status(404).send('Payment not found.');
//     }

//     res.json(updatedPayment);
//   } catch (error) {
//     console.error('Error updating payment status:', error);
//     res.status(500).send('Server error. Please try again later.');
//   }
// };

// ================================================

import Stripe from "stripe";
import axios from "axios";
import Payment from "../models/paymentModel.js";
import Calendar from "../models/calendarModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

// // Create Stripe Payment Intent Handler =========================================

// export const createStripePaymentIntentHandler = async (req, res) => {
//   const {
//     amount,
//     currency = "usd",
//     userId,
//     isMentee,
//     bookingId,
//     eventId,
//   } = req.body;

//   if (
//     !amount ||
//     !currency ||
//     !userId ||
//     typeof isMentee !== "boolean" ||
//     !eventId
//   ) {
//     return res
//       .status(400)
//       .send("Amount, currency, userId, isMentee, and bookingId are required.");
//   }

//   try {
//     if (!isMentee) {
//       return res.status(400).send("User must be a mentee to make a payment.");
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//     });

//     const payment = new Payment({
//       amount,
//       currency,
//       paymentIntentId: paymentIntent.id,
//       status: PAYMENT_STATUS.PENDING,
//       userId,
//       eventId,
//       bookingId,
//       isMentee,
//     });

//     await payment.save();
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Error creating Stripe payment intent:", error.message);
//     res.status(500).send("Server error. Please try again later.");
//   }
// };

// ================================================

export const createStripePaymentIntentHandler = async (req, res) => {
  const { bookingId } = req.body;
  const { userId, userRole } = req;

  console.log("Received request to create payment intent");
  console.log("Request body:", req.body);
  console.log("User ID:", userId);
  console.log("User Role:", userRole);

  if (!bookingId) {
    console.log("Booking ID is missing");
    return res.status(400).send("Booking ID is required.");
  }

  try {
    // Convert userRole to Boolean
    const isMentee = userRole === "mentee";
    console.log("Is Mentee:", isMentee);

    if (!isMentee) {
      console.log("User is not a mentee");
      return res.status(400).send("User must be a mentee to make a payment.");
    }

    // Fetch the amount (price) from the Calendar model using bookingId
    const calendarEvent = await Calendar.findById(bookingId);
    if (!calendarEvent) {
      console.log("Booking not found for ID:", bookingId);
      return res.status(404).send("Booking not found.");
    }

    const amount = calendarEvent.price * 100; // Convert to cents for Stripe
    console.log("Amount to be charged (in cents):", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    const payment = new Payment({
      amount,
      currency: "usd",
      paymentIntentId: paymentIntent.id,
      status: PAYMENT_STATUS.PENDING,
      userId,
      bookingId,
      isMentee,
    });

    await payment.save();
    console.log("Payment record saved:", payment.id);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error.message);
    res.status(500).send("Server error. Please try again later.");
  }
};

// Create PayPal Payment Handler ================================================

export const createPayPalPaymentHandler = async (req, res) => {
  const {
    amount,
    currency = "usd",
    userId,
    isMentee,
    paypalPaymentId,
    bookingId,
    eventId,
  } = req.body;

  if (
    !amount ||
    !currency ||
    !userId ||
    typeof isMentee !== "boolean" ||
    !paypalPaymentId ||
    !bookingId
  ) {
    return res
      .status(400)
      .send(
        "Amount, currency, userId, isMentee, paypalPaymentId, and bookingId are required."
      );
  }

  try {
    if (!isMentee) {
      return res.status(400).send("User must be a mentee to make a payment.");
    }

    const response = await axios.get(
      `https://api.paypal.com/v1/payments/payment/${paypalPaymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
        },
      }
    );

    if (response.data.state !== "approved") {
      return res.status(400).send("PayPal payment not approved.");
    }

    const payment = new Payment({
      amount,
      currency,
      paymentIntentId: paypalPaymentId,
      status: PAYMENT_STATUS.PENDING,
      userId,
      eventId,
      bookingId,
      isMentee,
    });

    await payment.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing PayPal payment:", error.message);
    res.status(500).send("Server error. Please try again later.");
  }
};
