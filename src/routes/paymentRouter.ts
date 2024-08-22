import express from 'express';
import { createPaymentIntentHandler, paymentStatusUpdateHandler } from '../controllers/paymentController.js';

const paymentRoutes = express.Router();

paymentRoutes.post('/create-payment-intent', createPaymentIntentHandler);
paymentRoutes.post('/update-payment-status', paymentStatusUpdateHandler);

export default paymentRoutes;
