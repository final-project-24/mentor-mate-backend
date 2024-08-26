import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mentorUuid: {
    type: String,
    required: true,
    index: true, // Add an index for performance
  },
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: {
    type: String,
    enum: ["available", "booked", "pending"], // Add a new status "pending"
    default: "available",
  },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  menteeUuid: { type: String, index: true }, // Add an index for performance
  paymentDeadline: { type: Date }, // New field to track payment deadline
  price: { type: Number, required: true, default: 45.00 }, // Add price field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Calendar = mongoose.model("Calendar", calendarSchema);

export default Calendar;
