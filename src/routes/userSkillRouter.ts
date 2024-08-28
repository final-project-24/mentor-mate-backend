import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import { validate } from "../middleware/validatorMiddleware.js";
import { paginationParamsValidationChain } from "../middleware/validationChains/paginationParamsValidationChain.js";
import { userSkillValidationChain } from "../middleware/validationChains/userSkillValidationChain.js";
import requireSpecificRole from "../middleware/requireSpecificRoleMiddleware.js";
import { 
  getUserSkills,
  createUserSkill,
  editUserSkill,
  deleteUserSkill,
  getMentorSkills
} from "../controllers/userSkillController.js";

const userSkillRoutes = express.Router()

// apply verifyToken to all routes
userSkillRoutes.use(verifyToken)

// apply requireSpecificRole to all routes
// userSkillRoutes.use(requireSpecificRole('mentor'))

// ... /app/user-skill/get-user-skills?queryParams
userSkillRoutes.get(
  '/get-user-skills', 
  validate(paginationParamsValidationChain),
  getUserSkills
)

// ... /app/user-skill/get-mentor-skills?queryParams
userSkillRoutes.get(
  '/get-mentor-skills',
  validate(paginationParamsValidationChain),
  getMentorSkills
)

// ... /app/user-skill/create-user-skill
userSkillRoutes.post(
  '/create-user-skill',
  requireSpecificRole('mentor'),
  validate(userSkillValidationChain),
  createUserSkill
)

// ... /app/user-skill/edit-user-skill/:id
userSkillRoutes.patch(
  '/edit-user-skill/:id',
  requireSpecificRole('mentor'),
  validate(userSkillValidationChain),
  editUserSkill
)

// ... /app/user-skill/delete-user-skill/:id
userSkillRoutes.delete(
  '/delete-user-skill/:id',
  requireSpecificRole('mentor'),
  deleteUserSkill
)

export default userSkillRoutes
