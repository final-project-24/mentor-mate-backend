import express from 'express';
import {
  createStripePaymentIntentHandler,
  createPayPalPaymentHandler
} from '../controllers/paymentController.js';

const paymentRoutes = express.Router();

// Route for creating a Stripe Payment Intent
paymentRoutes.post('/stripe/create-payment-intent', createStripePaymentIntentHandler);

// Route for creating a PayPal Payment
paymentRoutes.post('/paypal/create-payment', createPayPalPaymentHandler);

// Route for getting payment route information or status
// paymentRoutes.get('/payment', (req, res) => {
//   res.status(200).json({
//     message: 'Payment API is running',
//     routes: {
//       stripe: {
//         createPaymentIntent: '/payment/stripe/create-payment-intent'
//       },
//       paypal: {
//         createPayment: '/payment/paypal/create-payment'
//       }
//     }
//   });
// });

export default paymentRoutes;
