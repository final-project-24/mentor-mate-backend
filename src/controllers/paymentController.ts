import Stripe from 'stripe';
import Payment from '../models/paymentModel.js';
import Calendar from '../models/calendarModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const createStripePaymentIntentHandler = async (req, res) => {
  const { bookingId } = req.body;
  const { userId, userRole } = req;

  console.log('Received request to create payment intent', { bookingId, userId, userRole });

  if (!bookingId) {
    console.error('Booking ID is missing');
    return res.status(400).send('Booking ID is required.');
  }

  if (userRole !== 'mentee') {
    console.error('User is not a mentee');
    return res.status(400).send('User must be a mentee to make a payment.');
  }

  try {
    // Fetch the amount (price) from the Calendar model using bookingId
    const calendarEvent = await Calendar.findById(bookingId);
    if (!calendarEvent) {
      console.error('Booking not found for ID:', bookingId);
      return res.status(404).send('Booking not found.');
    }

    const amount = calendarEvent.price * 100; // Convert to cents for Stripe
    console.log('Amount to be charged (in cents):', amount);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Create or update the payment record in the database with a PENDING status
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        amount,
        currency: 'usd',
        status: PAYMENT_STATUS.PENDING,
        userId,
        bookingId,
        isMentee: true,
      },
      { upsert: true, new: true }
    );

    console.log('Payment record created or updated:', payment.id);

    // Send the client secret to the frontend to complete the payment
    res.json({ clientSecret: paymentIntent.client_secret });

    // Implement polling method to handle payment confirmation
    pollPaymentStatus(paymentIntent.id, bookingId, calendarEvent.paymentDeadline);

  } catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).send('Server error. Please try again later.');
  }
};

// Function to poll payment status
const pollPaymentStatus = (paymentIntentId, bookingId, paymentDeadline) => {
  const checkPaymentStatusInterval = 30000; 

  const checkAndHandlePaymentStatus = async () => {
    try {
      const updatedStatus = await checkPaymentStatus(paymentIntentId);
      const currentTime = new Date();

      if (updatedStatus === PAYMENT_STATUS.PENDING && currentTime > new Date(paymentDeadline)) {
        console.log('⏰ Payment window expired. Setting booking to AVAILABLE.');
        await handlePaymentOutcome(PAYMENT_STATUS.FAILED, paymentIntentId, bookingId);
      } else if (updatedStatus !== PAYMENT_STATUS.PENDING) {
        await handlePaymentOutcome(updatedStatus, paymentIntentId, bookingId);
      }
    } catch (error) {
      console.error('Error checking payment status:', error.message);
    }
  };

  setInterval(checkAndHandlePaymentStatus, checkPaymentStatusInterval); 
};

const checkPaymentStatus = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Retrieved payment intent status:', paymentIntent.status);
    const { status } = paymentIntent;

    switch (status) {
      case 'succeeded':
        return PAYMENT_STATUS.SUCCESS;
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return PAYMENT_STATUS.PENDING;
      default:
        return PAYMENT_STATUS.FAILED;
    }
  } catch (error) {
    console.error('Error retrieving payment intent:', error.message);
    return PAYMENT_STATUS.FAILED;
  }
};
//Example: the requires_payment_method status for a Stripe PaymentIntent indicates that additional action is required to complete the payment. Specifically, it means that the PaymentIntent has been created, but the payment method has not been fully provided or confirmed yet.

const handlePaymentOutcome = async (status, paymentIntentId, bookingId) => {
  if (status === PAYMENT_STATUS.SUCCESS) {
    await Payment.findOneAndUpdate({ paymentIntentId }, { status: PAYMENT_STATUS.SUCCESS });
    await Calendar.findByIdAndUpdate(bookingId, { status: 'booked' });
    console.log('✅ Payment status updated to SUCCESS. Booking status updated to BOOKED.');
  } else {
    await Payment.findOneAndUpdate({ paymentIntentId }, { status: PAYMENT_STATUS.FAILED });
    await Calendar.findByIdAndUpdate(bookingId, { status: 'available' });
    console.log('❌ Payment failed or window expired. Booking has been made AVAILABLE.');
  }
};

// Payment Status Update Handler
export const paymentStatusUpdateHandler = async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res    .status(400)
    .send('PaymentIntentId is required.');
  }

  try {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).send('PaymentIntent not found.');
    }

    console.log('Retrieved payment intent status:', paymentIntent.status);

    // Determine the status based on the Stripe payment intent status
    let status;
    switch (paymentIntent.status) {
      case 'succeeded':
        status = PAYMENT_STATUS.SUCCESS;
        break;
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        status = PAYMENT_STATUS.PENDING;
        break;
      case 'canceled':
      case 'requires_capture':
      case 'processing':
      default:
        status = PAYMENT_STATUS.FAILED;
        break;
    }

    console.log('Updating payment status to:', status);

    // Update the payment status in the database
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentIntentId },
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).send('Payment not found.');
    }

    console.log('Updated payment:', updatedPayment);

    res.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};


