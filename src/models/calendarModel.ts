import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
  status: { type: String, enum: ["available", "booked"], default: "available" },
  // bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Changed from bookedBy to menteeId
  menteeUuid: { type: String, index: true }, // Add an index for performance
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Calendar = mongoose.model("Calendar", calendarSchema);

export default Calendar;
