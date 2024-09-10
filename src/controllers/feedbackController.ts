import { Request, Response } from "express";
import Feedback from "../models/feedbackModel.js";

// submit feedback ============================================================

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { bookingId, mentorUuid, menteeUuid, ...feedbackData } = req.body; // Extract bookingId, mentorUuid, and menteeUuid from the request body
    const userRole = req.userRole; // Extract userRole from the request (assuming verifyTokenMiddleware adds it to the request object)

    console.log("🔎 Extracted bookingId:", bookingId); // Log the extracted bookingId
    console.log("🔎 Feedback data:", feedbackData); // Log the feedback data
    console.log("🔎 User role:", userRole); // Log the user role
    console.log("🔎 Mentor UUID:", mentorUuid); // Log the mentor UUID
    console.log("🔎 Mentee UUID:", menteeUuid); // Log the mentee UUID

    // Conditionally add mentorUuid or menteeUuid to the feedback data based on the userRole
    if (userRole === "mentee") {
      feedbackData.mentorUuid = mentorUuid;
    } else if (userRole === "mentor") {
      feedbackData.menteeUuid = menteeUuid;
    }

    // const feedback = new Feedback(feedbackData);
    const feedback = new Feedback({ ...feedbackData, bookingId }); // Include bookingId in the feedback data
    await feedback.save();

    console.log("✅ Feedback successfully saved:", feedback); // Log the saved feedback
    res.status(201).json(feedback);
  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
};

// get feedback for a specific booking ========================================

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { bookingId, mentorUuid, menteeUuid } = req.query; // Extract bookingId, mentorUuid, and menteeUuid from the query parameters
    const userRole = req.userRole; // Extract userRole from the request (assuming verifyTokenMiddleware adds it to the request object)

    console.log("🔎 Fetching feedback for bookingId:", bookingId); // Log the bookingId
    console.log("🔎 User role:", userRole); // Log the user role
    console.log("🔎 Mentor UUID:", mentorUuid); // Log the mentor UUID
    console.log("🔎 Mentee UUID:", menteeUuid); // Log the mentee UUID

    let feedback;
    if (userRole === "mentee") {
      feedback = await Feedback.findOne({ bookingId, menteeUuid });
    } else if (userRole === "mentor") {
      feedback = await Feedback.findOne({ bookingId, mentorUuid });
    }

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    console.log("✅ Feedback fetched successfully:", feedback); // Log the fetched feedback
    res.status(200).json(feedback);
  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
};
