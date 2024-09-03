import { Request, Response } from "express";
import Calendar from "../models/calendarModel.js";
import User from "../models/userModel.js";
import userSkillModel from "../models/userSkillModel.js";

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
      .populate({
        path: "protoSkillId",
        populate: {
          path: "skillCategoryId",
          // model: "skill_category", // Ensure the correct model is used for population
        },
      })
      .lean(); // Convert to plain JavaScript objects

    // Map skills to availableTopics format
    const availableSkills = skills.map((skill) => ({
      skillCategoryTitle: skill.protoSkillId.skillCategoryId.skillCategoryTitle,
      skillCategoryDescription:
        skill.protoSkillId.skillCategoryId.skillCategoryDescription,
      protoSkillTitle: skill.protoSkillId.protoSkillTitle,
      protoSkillDescription: skill.protoSkillId.protoSkillDescription,
      proficiency: skill.proficiency,
    }));

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
     const skill = await userSkillModel
     .findById(req.body.skillId)
     .populate({
       path: "protoSkillId",
       populate: {
         path: "skillCategoryId",
       },
     })
     .lean();

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const selectedSkill = {
      skillCategoryTitle: skill.protoSkillId.skillCategoryId.skillCategoryTitle,
      skillCategoryDescription:
        skill.protoSkillId.skillCategoryId.skillCategoryDescription,
      protoSkillTitle: skill.protoSkillId.protoSkillTitle,
      protoSkillDescription: skill.protoSkillId.protoSkillDescription,
      proficiency: skill.proficiency,
    };

    const paymentDeadline = new Date();
    paymentDeadline.setMinutes(paymentDeadline.getMinutes() + 15); // Set deadline to 15 minutes from now

    event.status = "pending"; // Set the status to pending
    event.menteeId = req.userId; // Add menteeId
    event.menteeUuid = mentee.uuid; // Add menteeUuid
    event.paymentDeadline = paymentDeadline; // Set the payment deadline
    event.selectedSkill = [selectedSkill]; // Add the chosen skill to the event

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
