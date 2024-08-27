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
  // deleteUserSkill
} from "../controllers/userSkillController.js";

const userSkillRoutes = express.Router()

// apply verifyToken to all routes
userSkillRoutes.use(verifyToken)

// apply requireSpecificRole to all routes
// userSkillRoutes.use(requireSpecificRole('mentor'))

userSkillRoutes.get(
  '/get-user-skills', 
  validate(paginationParamsValidationChain),
  getUserSkills
)

userSkillRoutes.post(
  '/create-user-skill',
  requireSpecificRole('mentor'),
  validate(userSkillValidationChain),
  createUserSkill
)

userSkillRoutes.patch(
  '/edit-user-skill/:id',
  requireSpecificRole('mentor'),
  validate(userSkillValidationChain),
  editUserSkill
)

// userSkillRoutes.delete(
//   '/delete-user-skill/:id',
//   requireSpecificRole('mentor'),
//   deleteUserSkill
// )

export default userSkillRoutes
