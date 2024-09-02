import Stripe from "stripe";
import axios from "axios";
>>>>>>> origin/main
import Payment from "../models/paymentModel.js";
import Calendar from "../models/calendarModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

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

    // Create or update the payment record in the database with a PENDING status
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id }, // Search by paymentIntentId
      {
        amount,
        currency: "usd",
        status: PAYMENT_STATUS.PENDING,
        userId,
        bookingId,
        isMentee,
      },
      { upsert: true, new: true } // Insert a new record if it doesn't exist
    );

    console.log("Payment record created or updated:", payment.id);

    // Send the client secret to the frontend to complete the payment
    res.json({ clientSecret: paymentIntent.client_secret });

    // Simulate payment confirmation logic
    // (Replace with actual logic to check payment status via Stripe API)
    const isPaymentSuccessful = true; // Placeholder for demonstration purposes

    // Update the payment and booking status upon successful payment
    if (isPaymentSuccessful) {
      // Update payment status to SUCCESS
      const updatedPayment = await Payment.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: PAYMENT_STATUS.SUCCESS },
        { new: true }
      );

      // Update booking status to 'booked'
      await Calendar.findByIdAndUpdate(bookingId, { status: "booked" });

      console.log("Payment status updated to SUCCESS:", updatedPayment.id);
    } else {
      console.log("Payment not successful. Status remains PENDING.");
    }
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).send("Server error. Please try again later.");
  }
};
