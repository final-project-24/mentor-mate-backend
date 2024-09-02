// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   paymentIntentId: { type: String, required: true, unique: true },
//   status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   isMentee: { type: Boolean, required: true }, 
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const Payment = mongoose.model('Payment', paymentSchema);
// export default Payment;

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar', // Ensure this matches your Calendar model
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', // Ensure this matches your Booking model
  },
  isMentee: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true, 
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;