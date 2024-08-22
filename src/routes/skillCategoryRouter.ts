import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import { validate } from "../middleware/validatorMiddleware.js";
import { skillCategoryValidationChain } from "../middleware/validationChains/skillCategoryValidationChain.js";
import { paginationParamsValidationChain } from "../middleware/validationChains/paginationParamsValidationChain.js";
import checkIfAdmin from "../middleware/checkIfAdminMiddleware.js";
import { 
  createSkillCategory, 
  deleteSkillCategory, 
  editSkillCategory, 
  getSkillCategories
} from "../controllers/skillCategoryController.js";

const skillCategoryRoutes = express.Router()

// apply verifyToken to all routes
skillCategoryRoutes.use(verifyToken)

// apply checkIfAdmin to all routes
skillCategoryRoutes.use(checkIfAdmin)

// ... /app/skill-category/get-skill-categories/?queryParams
skillCategoryRoutes.get(
  '/get-skill-categories', 
  validate(paginationParamsValidationChain),
  getSkillCategories
)

// ... /app/skill-category/create-skill-category
skillCategoryRoutes.post(
  '/create-skill-category', 
  validate(skillCategoryValidationChain),
  createSkillCategory
)

// ... /app/skill-category/edit-skill-category
skillCategoryRoutes.patch(
  '/edit-skill-category/:id', 
  validate(skillCategoryValidationChain),
  editSkillCategory
)

// ... /app/skill-category/delete-skill-category
skillCategoryRoutes.delete(
  '/delete-skill-category/:id',
  deleteSkillCategory
)

export default skillCategoryRoutes
