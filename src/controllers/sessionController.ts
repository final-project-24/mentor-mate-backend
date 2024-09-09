import { Request, Response } from 'express';
import Session from '../models/sessionModel.js';
import Calendar from "../models/calendarModel.js";
import User from "../models/userModel.js";
import mongoose from 'mongoose';
import userSkillModel from "../models/userSkillModel.js";
import protoSkillModel from "../models/protoSkillModel.js";
import skillCategoryModel from "../models/skillCategoryModel.js";

// Get all upcoming sessions ==================================================

export const getUpcomingSessions = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Incoming request to get upcoming sessions");

    const userId = req.userId; // Extract userId from the request
    const userRole = req.userRole; // Extract userRole from the request
    console.log(`🔎 Extracted userId from request: ${userId}`);
    console.log(`🔎 Extracted userRole from request: ${userRole}`);

    const currentDate = new Date(); // Get the current date
    console.log(`🔎 Current date: ${currentDate}`);

    // Define the query object with a more flexible type
    let query: {
      start: { $gt: Date };
      status: string;
      menteeId?: string;
      mentorId?: string;
    } = { start: { $gt: currentDate }, status: "booked" };

    // Conditionally add menteeId or mentorId to the query based on the userRole
    if (userRole === "mentee") {
      query = { ...query, menteeId: userId };
    } else if (userRole === "mentor") {
      query = { ...query, mentorId: userId };
    }

    const sessions = await Calendar.find(query)
      .populate("mentorId", "image userName role")
      .populate("menteeId", "userName email");

    console.log(`🔎 Found ${sessions.length} upcoming sessions`);

    if (!sessions.length) {
      console.log("🔎 No upcoming sessions found for this user.");
      return res
        .status(404)
        .json({ message: "No upcoming sessions found for this user." });
    }

    res.status(200).json(sessions);
    console.log("✅ Successfully fetched upcoming sessions");
  } catch (error) {
    console.error("❌ Error fetching upcoming session details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get past sessions ==================================================

export const getPastSessions = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Incoming request to get all past sessions");

    const userId = req.userId; // Extract userId from the request
    const userRole = req.userRole; // Extract userRole from the request
    console.log(`🔎 Extracted userId from request: ${userId}`);
    console.log(`🔎 Extracted userRole from request: ${userRole}`);

    const currentDate = new Date(); // Get the current date
    console.log(`🔎 Current date: ${currentDate}`);

    // Define the query object with a more flexible type
    let query: {
      start: { $lt: Date };
      status: string;
      menteeId?: string;
      mentorId?: string;
    } = { start: { $lt: currentDate }, status: "booked" };

    // Conditionally add menteeId or mentorId to the query based on the userRole
    if (userRole === "mentee") {
      query = { ...query, menteeId: userId };
    } else if (userRole === "mentor") {
      query = { ...query, mentorId: userId };
    }

    const sessions = await Calendar.find(query)
      .populate("mentorId", "image userName role")
      .populate("menteeId", "userName email");

    console.log(`🔎 Found ${sessions.length} past sessions`);

    if (!sessions.length) {
      console.log("🔎 No past sessions found for this user.");
      return res
        .status(404)
        .json({ message: "No past sessions found for this user." });
    }

    res.status(200).json(sessions);
    console.log("✅ Successfully fetched past sessions");
  } catch (error) {
    console.error("❌ Error fetching past session details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel session =================================================

export const cancelSession = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Incoming request to cancel session");

    const sessionId = req.params.id; // Get session ID from request parameters
    const userId = req.userId; // Extract user ID from the request
    console.log(`🔎 Extracted sessionId from request: ${sessionId}`);
    console.log(`🔎 Extracted userId from request: ${userId}`);

    const currentDate = new Date(); // Get the current date
    console.log(`🔎 Current date: ${currentDate}`);

    // Check if userId and sessionId are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(sessionId)) {
      console.log("❌ Invalid user ID or session ID.");
      return res.status(400).json({ message: "Invalid user ID or session ID." });
    }

    // Find the session
    const session = await Calendar.findById(sessionId);
    if (!session) {
      console.log("❌ Session not found.");
      return res.status(404).json({ message: "Session not found." });
    }

    console.log(`🔎 Session found: ${JSON.stringify(session)}`);

    // Check if the session is already canceled
    if (session.status === 'canceled') {
      console.log("❌ Session is already canceled.");
      return res.status(400).json({ message: "Session is already canceled." });
    }

    // Check if the cancellation is within the 24-hour period
    const sessionStartTime = new Date(session.start);
    const timeDifference = sessionStartTime.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      console.log("❌ Cancellation must be done at least 24 hours before the session starts.");
      return res.status(400).json({ message: "Cancellation must be done at least 24 hours before the session starts." });
    }

    // Update the session status to 'canceled'
    session.status = 'canceled';
    session.canceledBy = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId
    session.freeSessionToken = true; // Set a flag to indicate a free token is issued
    await session.save();

    // Add free session token to the mentee's account
    const mentee = await User.findById(userId);
    if (mentee) {
      mentee.freeSessionTokens = (mentee.freeSessionTokens || 0) + 1; // Increment the free session tokens count
      await mentee.save();
    }

    console.log("✅ Session canceled and free token issued.");
    res.status(200).json({ message: "Session canceled successfully. A free session token has been issued." });
  } catch (error) {
    console.error("❌ Error canceling the session:", error);
    res.status(500).json({ message: "Server error" });
  }
};