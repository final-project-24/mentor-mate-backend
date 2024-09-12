import { Request, Response } from "express";
import Feedback from "../models/feedbackModel.js";
import userModel from "../models/userModel.js";
import userSkillModel from "../models/userSkillModel.js";

// submit feedback ============================================================
// Mentors are useing the bookingId and the menteeUuid to submit feedback
// Mentees are using the bookingId and the mentorUuid to submit feedback

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
// Mentors are using the bookingId and their UUID to fetch feedback
// Mentees are using the bookingId and their UUID to fetch feedback

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

// get feedback by rating for mentor ==========================================

// Fetch feedbacks with publicFeedback true and mentorUuid
export const getPublicFeedbacks = async (req: Request, res: Response) => {
  try {
    console.log("🔎 Fetching public feedbacks with mentorUuid...");

    // Fetch feedbacks with publicFeedback true and mentorUuid
    const feedbacks = await Feedback.find({
      publicFeedback: true,
      mentorUuid: { $exists: true },
    });

    if (feedbacks.length === 0) {
      console.log("❌ No public feedbacks found");
      return res.status(404).json({ message: "No public feedbacks found" });
    }

    console.log(
      `🔎 Found ${feedbacks.length} feedbacks. Grouping by mentorUuid and selecting highest rated feedback...`
    );

    // Group feedbacks by mentorUuid and select the highest rated feedback for each mentor
    const feedbackMap = new Map();
    feedbacks.forEach((feedback) => {
      const { mentorUuid, rating } = feedback;
      if (
        !feedbackMap.has(mentorUuid) ||
        feedbackMap.get(mentorUuid).rating < rating
      ) {
        feedbackMap.set(mentorUuid, feedback);
      }
    });

    console.log(
      `🔎 Grouped feedbacks into ${feedbackMap.size} unique mentors. Limiting results to 10...`
    );

    // Convert the map to an array and limit the results to 10
    const limitedFeedbacks = Array.from(feedbackMap.values()).slice(0, 10);

    console.log("🔎 Fetching mentor details and skills for each feedback...");

    // Fetch mentor details and skills for each feedback
    const feedbacksWithMentorDetails = await Promise.all(
      limitedFeedbacks.map(async (feedback) => {
        const { mentorUuid } = feedback;

        // Fetch the mentor's userName from userModel
        const mentor = await userModel
          .findOne({ uuid: mentorUuid })
          .select("uuid userName");

        if (!mentor) {
          console.log(`❌ Mentor with UUID ${mentorUuid} not found`);
          return { ...feedback.toObject(), mentor: null, skills: [] };
        }

        // Fetch the skills for the mentor
        const skills = await userSkillModel
          .find({ mentorUuid, isActive: true })
          .populate({
            path: "protoSkillId",
            populate: {
              path: "skillCategoryId",
            },
          });

        console.log(`✅ Fetched details for mentor UUID ${mentorUuid}`);
        return { ...feedback.toObject(), mentor, skills };
      })
    );

    console.log("✅ Successfully fetched public feedbacks with mentor details and skills");
    res.status(200).json(feedbacksWithMentorDetails);
  } catch (error) {
    console.error("❌ Error fetching public feedbacks:", error);
    res.status(500).json({ message: "Error fetching public feedbacks" });
  }
};
