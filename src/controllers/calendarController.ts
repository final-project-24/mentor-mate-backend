import { Request, Response } from "express";
import Calendar from "../models/calendarModel.js";
import User from "../models/userModel.js";
import userSkillModel from "../models/userSkillModel.js";
import protoSkillModel from "../models/protoSkillModel.js";
import skillCategoryModel from "../models/skillCategoryModel.js";

// // Define interfaces for populated documents
// interface PopulatedProtoSkill extends IProtoSkill {
//   skillCategoryId: ISkillCategory;
// }

// interface PopulatedUserSkill extends IUserSkill {
//   protoSkillId: PopulatedProtoSkill;
// }

// Get available slots for a specific mentor ===================================
export const getMentorAvailability = async (req, res) => {
  try {
    console.log("🔎 Request received for mentor availability");

    let mentorUuid = req.params.mentorUuid; // Use mentorUuid if provided
    let mentorId = req.userId; // Use userId from the request

    console.log("🔎 Mentor UUID from params:", mentorUuid);
    console.log("🔎 Mentor ID from request:", mentorId);

    // Determine the mentor identifier to use
    if (!mentorUuid && req.userRole === "mentor") {
      console.log("🔎 Using userId as mentorId:", mentorId);
    }

    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);
    console.log("🔎 Start Date:", startDate);
    console.log("🔎 End Date:", endDate);

    // Fetch available slots directly from the Calendar model
    const availableSlots = await Calendar.find({
      $or: [{ mentorId: mentorId }, { mentorUuid: mentorUuid }],
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

// Mentor adds available time slots ============================================
export const addCalendarEvent = async (req: Request, res: Response) => {
  try {
    if (req.userRole !== "mentor") {
      return res
        .status(403)
        .json({ message: "Only mentors can add available time slots." });
    } // Check if the user is a mentor

    const mentor = await User.findById(req.userId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    } // Check if the mentor exists and provide the mentorUuid

    // Fetch skills for the mentor
    const skills = await userSkillModel
      .find({ mentorUuid: mentor.uuid, isActive: true })
      .lean();

    // Manually fetch and merge the related data
    const availableSkills = await Promise.all(
      skills.map(async (skill) => {
        const protoSkill = await protoSkillModel
          .findById(skill.protoSkillId)
          .lean();
        const skillCategory = await skillCategoryModel
          .findById(protoSkill.skillCategoryId)
          .lean();

        return {
          skillCategoryTitle: skillCategory.skillCategoryTitle,
          skillCategoryDescription: skillCategory.skillCategoryDescription,
          protoSkillTitle: protoSkill.protoSkillTitle,
          protoSkillDescription: protoSkill.protoSkillDescription,
          proficiency: skill.proficiency,
        };
      })
    );

    console.log(
      `✅ Found ${availableSkills.length} skills for mentor: ${mentor.uuid}`
    );
    console.log("Incoming skill data structure:", availableSkills);

    const newEvent = new Calendar({
      ...req.body, // Spread the request body to get the title, description, start, and end
      mentorId: req.userId, // add the mentorId
      mentorUuid: mentor.uuid, // Add mentorUuid
      status: "available", // Set the status to available
      price: 90.0, // Add the price for the session
      availableSkills, // Add the entire skills object to the event
    }); // Create a new calendar event

    const savedEvent = await newEvent.save(); // Save the new calendar event
    console.log("✅ New calendar event saved:", savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("❌ Error adding calendar event:", error);
    res.status(500).json({ message: error.message });
  }
};

// Book a calendar event (mentee books a slot) ==================================

// const generateRandomGoogleMeetCode = () => {
//   const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
//   let code = "";
//   for (let i = 0; i < 10; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return `${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(7, 10)}`;
// };

// Marina logic ========
const generateJitsiLink = (roomName) => {
  return `https://meet.jit.si/${roomName}`;
};

const generateGoogleMeetLink = (roomName) => {
  return `https://meet.google.com/${roomName}`;
};

// const generateGoogleMeetLink = () => {
//   const roomName = generateRandomGoogleMeetCode();
//   return `https://meet.google.com/${roomName}`;
// };
// =====================

export const bookCalendarEvent = async (req, res) => {
  // export const bookCalendarEvent = async (req: Request, res: Response) => {
  try {
    if (req.userRole !== "mentee") {
      return res
        .status(403)
        .json({ message: "Only mentee's can book time slots." });
    } // Check if the user is a mentee

    const event = await Calendar.findById(req.params.id);
    if (!event || event.status !== "available") {
      return res.status(404).json({ message: "Time slot not available." });
    } // Check if the event exists and is available

    const mentee = await User.findById(req.userId);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    } // Check if the mentee exists and provide the menteeUuid

    // Fetch the skill data using the skill ID from the request body
    const skill = await userSkillModel.findById(req.body.skillId).lean();
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // Manually fetch and merge the related data
    const protoSkill = await protoSkillModel
      .findById(skill.protoSkillId)
      .lean();
    const skillCategory = await skillCategoryModel
      .findById(protoSkill.skillCategoryId)
      .lean();

    const selectedSkill = {
      skillCategoryTitle: skillCategory.skillCategoryTitle,
      skillCategoryDescription: skillCategory.skillCategoryDescription,
      protoSkillTitle: protoSkill.protoSkillTitle,
      protoSkillDescription: protoSkill.protoSkillDescription,
      proficiency: skill.proficiency,
    };

    const paymentDeadline = new Date();
    paymentDeadline.setMinutes(paymentDeadline.getMinutes() + 15); // Set deadline to 15 minutes from now

    // Marina logic ========
    const jitsiLink = generateJitsiLink(event._id);
    const googleMeetLink = generateGoogleMeetLink(event._id);
    // const googleMeetLink = generateGoogleMeetLink();
    // =====================

    event.status = "pending"; // Set the status to pending
    event.menteeId = req.userId; // Add menteeId
    event.menteeUuid = mentee.uuid; // Add menteeUuid
    event.paymentDeadline = paymentDeadline; // Set the payment deadline
    event.selectedSkill = [selectedSkill]; // Add the chosen skill to the event
    // Marina logic ========
    event.jitsiLink = jitsiLink;
    event.googleMeetLink = googleMeetLink;
    // =====================

    const updatedEvent = await event.save(); // Save the updated event
    console.log("✅ Calendar event booked (pending payment):", updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("❌ Error booking calendar event:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get booking details =========================================================
export const getBookingDetails = async (req, res) => {
  try {
    console.log("🔎 Fetching booking details for ID:", req.params.id);

    const booking = await Calendar.findById(req.params.id)
      .populate("mentorId", "image userName role skills")
      .populate("menteeId", "userName email");

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

// // get all upcoming sessions ==================================================

// export const getUpcomingSessions = async (req: Request, res: Response) => {
//   try {
//     console.log("🔍 Incoming request to get upcoming sessions");

//     const userId = req.userId; // Extract userId from the request
//     const userRole = req.userRole; // Extract userRole from the request
//     console.log(`🔎 Extracted userId from request: ${userId}`);
//     console.log(`🔎 Extracted userRole from request: ${userRole}`);

//     const currentDate = new Date(); // Get the current date
//     console.log(`🔎 Current date: ${currentDate}`);

//     // Define the query object with a more flexible type
//     let query: {
//       start: { $gt: Date };
//       status: string;
//       menteeId?: string;
//       mentorId?: string;
//     } = { start: { $gt: currentDate }, status: "booked" };

//     // Conditionally add menteeId or mentorId to the query based on the userRole
//     if (userRole === "mentee") {
//       query = { ...query, menteeId: userId };
//     } else if (userRole === "mentor") {
//       query = { ...query, mentorId: userId };
//     }

//     const sessions = await Calendar.find(query)
//       .populate("mentorId", "image userName role")
//       .populate("menteeId", "userName email");

//     console.log(`🔎 Found ${sessions.length} upcoming sessions`);

//     if (!sessions.length) {
//       console.log("🔎  No upcoming sessions found for this user.");
//       return res
//         .status(404)
//         .json({ message: "No upcoming sessions found for this user." });
//     }

//     res.status(200).json(sessions);
//     console.log("✅ Successfully fetched upcoming sessions");
//   } catch (error) {
//     console.error("❌ Error fetching upcoming session details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // get  past sessions ==================================================

// export const getPastSessions = async (req: Request, res: Response) => {
//   try {
//     console.log("🔍 Incoming request to get all past sessions");

//     const userId = req.userId; // Extract userId from the request
//     const userRole = req.userRole; // Extract userRole from the request
//     console.log(`🔎 Extracted userId from request: ${userId}`);
//     console.log(`🔎 Extracted userRole from request: ${userRole}`);

//     const currentDate = new Date(); // Get the current date
//     console.log(`🔎 Current date: ${currentDate}`);

//     // Define the query object with a more flexible type
//     let query: {
//       start: { $lt: Date };
//       status: string;
//       menteeId?: string;
//       mentorId?: string;
//     } = { start: { $lt: currentDate }, status: "booked" };

//     // Conditionally add menteeId or mentorId to the query based on the userRole
//     if (userRole === "mentee") {
//       query = { ...query, menteeId: userId };
//     } else if (userRole === "mentor") {
//       query = { ...query, mentorId: userId };
//     }

//     const sessions = await Calendar.find(query)
//       .populate("mentorId", "image userName role")
//       .populate("menteeId", "userName email");

//     console.log(`🔎 Found ${sessions.length} past sessions`);

//     if (!sessions.length) {
//       console.log("🔎  No past sessions found for this user.");
//       return res
//         .status(404)
//         .json({ message: "No past sessions found for this user." });
//     }

//     res.status(200).json(sessions);
//     console.log("✅ Successfully fetched past sessions");
//   } catch (error) {
//     console.error("❌ Error fetching past session details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// cancel a session ==================================================

// Delete a calendar event (mentor deletes an available slot) ==================
export const deleteCalendarEvent = async (req: Request, res: Response) => {
  try {
    if (req.userRole !== "mentor") {
      return res
        .status(403)
        .json({ message: "Only mentors can delete available time slots." });
    } // Check if the user is a mentor

    const event = await Calendar.findById(req.params.id);
    if (!event || event.status !== "available") {
      return res.status(404).json({ message: "Time slot not available or already booked." });
    } // Check if the event exists and is available

    await Calendar.deleteOne({ _id: req.params.id }); // Use deleteOne method
    console.log("✅ Calendar event deleted:", event);
    res.status(200).json({ message: "Calendar event deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting calendar event:", error);
    res.status(500).json({ message: error.message });
  }
};
