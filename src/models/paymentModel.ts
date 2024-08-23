import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentIntentId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isMentee: { type: Boolean, required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
