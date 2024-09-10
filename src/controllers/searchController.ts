import { Request, Response } from "express";
import userModel from "../models/userModel.js";
import userSkillModel from "../models/userSkillModel.js";

// export const searchMentors = async (req: Request, res: Response) => {
//   const { query } = req.query;

//   if (!query) {
//     return res.status(400).json({ error: "Query parameter is required" });
//   }

//   try {
//     console.log("🔎 Received search request with query:", query); // Add logging

//     // Use aggregation to join userModel and userSkillModel
//     const mentors = await userModel.aggregate([
//       {
//         $match: {
//           role: "mentor",
//           $or: [
//             { userName: { $regex: query, $options: "i" } },
//             { "skills.protoSkillId.protoSkillTitle": { $regex: query, $options: "i" } }
//           ]
//         }
//       },
//       {
//         $lookup: {
//           from: "userSkills",
//           localField: "uuid",
//           foreignField: "mentorUuid",
//           as: "skills"
//         }
//       },
//       {
//         $unwind: {
//           path: "$skills",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: "protoSkills",
//           localField: "skills.protoSkillId",
//           foreignField: "_id",
//           as: "skills.protoSkillId"
//         }
//       },
//       {
//         $unwind: {
//           path: "$skills.protoSkillId",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: "skillCategories",
//           localField: "skills.protoSkillId.skillCategoryId",
//           foreignField: "_id",
//           as: "skills.protoSkillId.skillCategoryId"
//         }
//       },
//       {
//         $unwind: {
//           path: "$skills.protoSkillId.skillCategoryId",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: "$uuid",
//           userName: { $first: "$userName" },
//           skills: { $push: "$skills" }
//         }
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the _id field
//           uuid: "$_id",
//           userName: 1,
//           skills: 1
//         }
//       }
//     ]);

//     res.json(mentors);
//   } catch (error) {
//     console.error("❌ Error searching mentors:", error); // Add logging
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// searchMentors ==========================================

// export const searchMentors = async (req: Request, res: Response) => {
//   const { query } = req.query;

//   if (!query) {
//     return res.status(400).json({ error: "Query parameter is required" });
//   }

//   try {
//     console.log("🔎 Received search request with query:", query); // Add logging
//     const mentors = await userModel.find(
//       {
//         role: "mentor",
//         userName: { $regex: query, $options: "i" },
//       },
//       {
//         _id: 0, // Exclude the _id field
//       }
//     );

//     res.json(mentors);
//   } catch (error) {
//     console.error("❌ Error searching mentors:", error); // Add logging
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const searchMentors = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    console.log("🔎 Received search request with query:", query); // Add logging
    const mentors = await userModel.find(
      {
        role: "mentor",
        userName: { $regex: query, $options: "i" },
      },
      {
        _id: 0, // Exclude the _id field
      }
    );

    console.log(`✅ Found ${mentors.length} mentors matching the query`);

    // Fetch skills for each mentor
    const mentorsWithSkills = await Promise.all(
      mentors.map(async (mentor) => {
        const skills = await userSkillModel
          .find({ mentorUuid: mentor.uuid, isActive: true })
          .populate({
            path: "protoSkillId",
            populate: {
              path: "skillCategoryId",
            },
          });

        console.log(
          `✅ Found ${skills.length} skills for mentor: ${mentor.uuid}`
        );

        return {
          ...mentor.toObject(),
          skills: skills.length > 0 ? skills : null,
        };
      })
    );

    console.log("✅ Successfully fetched mentors and their skills");
    res.status(200).json(mentorsWithSkills);
  } catch (error) {
    console.error("❌ Error searching mentors:", error); // Add logging
    res.status(500).json({ error: "Internal server error" });
  }
};

// getMentorSkills ==========================================

export const getMentorSkills = async (req: Request, res: Response) => {
  // Log the entire request object to debug
  console.log("🔎 Request Params:", req.params);
  console.log("🔎 Request URL:", req.url);

  const { mentorUuid } = req.params;

  // Log the extracted mentorUuid
  console.log(`🔎 Extracted mentorUuid: ${mentorUuid}`);

  if (!mentorUuid) {
    return res.status(400).json({ error: "mentorUuid parameter is missing" });
  }

  try {
    // Verify if the mentor exists
    const mentor = await userModel
      .findOne({ uuid: mentorUuid })
      .select("uuid userName");

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    console.log(`🔎 Mentor found: ${mentorUuid}`);

    // Fetch all skills for the mentor
    const skills = await userSkillModel
      .find({ mentorUuid, isActive: true })
      .populate({
        path: "protoSkillId",
        populate: {
          path: "skillCategoryId",
        },
      });

    console.log(`✅ Skills found: ${skills.length}`);

    if (skills.length === 0) {
      return res.status(404).json({ error: "No skills found for this mentor" });
    }

    res.status(200).json({ mentor, skills });
  } catch (error) {
    console.error(`❌ Error fetching skills for mentor ${mentorUuid}:`, error);
    res.status(500).json({ error: error.message });
  }
};

/*
** // ! GET MENTORS BY UUID
*/

// extend Request with MentorSearchRequest
interface MentorSearchRequest extends Request {
  query: {
    query?: string | string[]; // can be a string or array of strings
  };
}

export const getMentorsByUuid = async (req: MentorSearchRequest, res: Response) => {
  let query = req.query.query;

  // convert query to array of strings
  if (typeof query === 'string') {
    // split by comma if it's a single string with comma separated UUIDs
    query = query.split(',').map(uuid => uuid.trim());
  } else if (Array.isArray(query)) {
    // if it's already an array, use it directly
    query = query.map(uuid => uuid.trim());
  } else {
    // if query is not provided or invalid
    return res.status(400).json({ error: "Query parameter must be a non-empty array of UUID strings" });
  }

  // check if the array is non-empty and contains only valid UUIDs
  if (query.length === 0 || !query.every(uuid => typeof uuid === 'string')) {
    return res.status(400).json({ error: "Query parameter must be a non-empty array of UUID strings" });
  }

  try {
    console.log("🔎 Received search request with UUID array:", query);

    // use $in operator to match UUIDs in the array
    const mentors = await userModel.find(
      {
        role: "mentor",
        uuid: { $in: query },
      },
      {
        _id: 0, // Exclude the _id field
      }
    ).sort({userName: 1})

    console.log(`✅ Found ${mentors.length} mentors matching the query`);

    // Fetch skills for each mentor
    const mentorsWithSkills = await Promise.all(
      mentors.map(async (mentor) => {
        const skills = await userSkillModel
          .find({ mentorUuid: mentor.uuid, isActive: true })
          .populate({
            path: "protoSkillId",
            populate: {
              path: "skillCategoryId",
            },
          });

        console.log(`✅ Found ${skills.length} skills for mentor: ${mentor.uuid}`);

        return {
          ...mentor.toObject(),
          skills: skills.length > 0 ? skills : null,
        };
      })
    );

    console.log("✅ Successfully fetched mentors and their skills");
    res.status(200).json(mentorsWithSkills);
  } catch (error) {
    console.error("❌ Error searching mentors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
