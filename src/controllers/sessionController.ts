import { Request, Response } from 'express';
import Session from '../models/sessionModel.js';
import Calendar from "../models/calendarModel.js";
import User from "../models/userModel.js";
import userSkillModel from "../models/userSkillModel.js";
import protoSkillModel from "../models/protoSkillModel.js";
import skillCategoryModel from "../models/skillCategoryModel.js";

// get all upcoming sessions ==================================================

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
      console.log("🔎  No upcoming sessions found for this user.");
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

// get  past sessions ==================================================

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
      console.log("🔎  No past sessions found for this user.");
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

