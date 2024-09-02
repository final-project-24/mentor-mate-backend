import Booking from "../models/bookingModel.js"; // Import Booking model
import User from "../models/userModel.js"; // Import User model

export const getBookingDetails = async (req, res) => {
  try {
    console.log("🔎 Fetching booking details for ID:", req.params.id);

    // Fetch booking details from Booking model
    const booking = await Booking.findById(req.params.id)
      .populate("mentorId", "image userName role skills")
      .populate("menteeId", "userName email")
      .populate("eventId"); // Populate eventId if needed

    if (!booking) {
      console.log("❌ Booking not found for ID:", req.params.id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking details found:", booking);
    res.json(booking);
  } catch (error) {
    console.error("❌ Error fetching booking details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
