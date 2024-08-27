import Stripe from 'stripe';
import axios from 'axios';
import Payment from '../models/paymentModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

// Create Stripe Payment Intent Handler
export const createStripePaymentIntentHandler = async (req, res) => {
  const { amount, currency = 'usd', userId, isMentee, bookingId, eventId } = req.body;

  if (!amount || !currency || !userId || typeof isMentee !== 'boolean' || !eventId) {
    return res.status(400).send('Amount, currency, userId, isMentee, and bookingId are required.');
  }

  try {
    if (!isMentee) {
      return res.status(400).send('User must be a mentee to make a payment.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    const payment = new Payment({
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      status: PAYMENT_STATUS.PENDING,
      userId,
      eventId,
      bookingId,
      isMentee,
    });

    await payment.save();
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error.message);
    res.status(500).send('Server error. Please try again later.');
  }
};

// Create PayPal Payment Handler
export const createPayPalPaymentHandler = async (req, res) => {
  const { amount, currency = 'usd', userId, isMentee, paypalPaymentId, bookingId, eventId } = req.body;

  if (!amount || !currency || !userId || typeof isMentee !== 'boolean' || !paypalPaymentId || !bookingId) {
    return res.status(400).send('Amount, currency, userId, isMentee, paypalPaymentId, and bookingId are required.');
  }

  try {
    if (!isMentee) {
      return res.status(400).send('User must be a mentee to make a payment.');
    }

    const response = await axios.get(`https://api.paypal.com/v1/payments/payment/${paypalPaymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
    });

    if (response.data.state !== 'approved') {
      return res.status(400).send('PayPal payment not approved.');
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
    console.error('Error processing PayPal payment:', error.message);
    res.status(500).send('Server error. Please try again later.');
  }
};

