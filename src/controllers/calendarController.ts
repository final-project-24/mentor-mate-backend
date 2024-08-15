import Calendar from "../models/calendarModel.js";
import User from "../models/userModel.js";

// Get available slots for a specific mentor ----------------------------------
export const getMentorAvailability = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    // Validate that the requested mentor exists and is indeed a mentor
    const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if the requesting user is a mentee + Allow mentors to view their own availability
    if (req.userRole !== "mentee" && req.userId !== mentorId) {
      return res
        .status(403)
        .json({ message: "Only mentees can view mentor availability." });
    }

    const availableSlots = await Calendar.find({
      userId: mentorId,
      status: "available",
      start: { $gte: startDate },
      end: { $lte: endDate },
    }).sort("start");

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error retrieving mentor availability:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new calendar event (mentor adds available time slot) ------------------
export const addCalendarEvent = async (req, res) => {
  try {
    if (req.userRole !== "mentor") {
      return res
        .status(403)
        .json({ message: "Only mentors can add available time slots." });
    }

    const newEvent = new Calendar({
      ...req.body,
      userId: req.userId,
      status: "available",
    });
    const savedEvent = await newEvent.save();
    console.log("New calendar event saved:", savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error adding calendar event:", error);
    res.status(500).json({ message: error.message });
  }
};

// Book a calendar event (mentee books a slot) --------------------------------
export const bookCalendarEvent = async (req, res) => {
  try {
    if (req.userRole !== "mentee") {
      return res
        .status(403)
        .json({ message: "Only mentees can book time slots." });
    }

    const event = await Calendar.findById(req.params.id);
    if (!event || event.status !== "available") {
      return res.status(404).json({ message: "Time slot not available." });
    }

    event.status = "booked";
    event.bookedBy = req.userId;
    const updatedEvent = await event.save();
    console.log("Calendar event booked:", updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error booking calendar event:", error);
    res.status(500).json({ message: error.message });
  }
};

// booking details --------------------------------

export const getBookingDetails = async (req, res) => {
  try {
    console.log("Fetching booking details for ID:", req.params.id);

    const booking = await Calendar.findById(req.params.id)
      .populate("userId", "userName") // Populate mentor information
      .populate("bookedBy", "userName"); // Populate user who booked information

    if (!booking) {
      console.log("Booking not found for ID:", req.params.id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking details found:", booking);
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
