import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mentorUuid: { type: String, index: true },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  menteeUuid: { type: String, index: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calendar",
    required: true,
  }, // Link to Calendar event
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  price: { type: Number, required: true, default: 45.00 }, // Add price field
  isAgreed: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false }, // Field to track payment status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

