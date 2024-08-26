// import Calendar from "../models/calendarModel.js";
// import User from "../models/userModel.js";

// // booking details =============================================================



// export const getBookingDetails = async (req, res) => {
//     try {
//       console.log("🔎 Fetching booking details for ID:", req.params.id);
  
//       const booking = await Calendar.findById(req.params.id)
//         .populate("mentorId", "image userName role skills")
//         .populate("menteeId", "userName email");
  
//       if (!booking) {
//         console.log("❌ Booking not found for ID:", req.params.id);
//         return res.status(404).json({ message: "Booking not found" });
//       }
  
//       console.log("✅ Booking details found:", booking);
//       res.json(booking);
//     } catch (error) {
//       console.error("❌ Error fetching booking details:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };