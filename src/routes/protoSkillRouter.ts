import express from 'express'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { validate } from '../middleware/validatorMiddleware.js'
import { protoSkillValidationChain } from '../middleware/validationChains/protoSkillValidationChain.js'
import { paginationParamsValidationChain } from '../middleware/validationChains/paginationParamsValidationChain.js'
import { protoSkillParamsValidationChain } from '../middleware/validationChains/protoSkillParamsValiationChain.js'
import requireSpecificRole from '../middleware/requireSpecificRoleMiddleware.js'
import { 
  createProtoSkill, 
  deleteProtoSkill, 
  editProtoSkill, 
  getProtoSkills
} from '../controllers/protoSkillController.js'

const protoSkillRoutes = express.Router()

// apply verifyToken to all routes
protoSkillRoutes.use(verifyToken)

// apply checkIfAdmin to all routes
// protoSkillRoutes.use(requireSpecificRole('admin'))

// ... /app/proto-skill/get-proto-skills?queryParams
protoSkillRoutes.get(
  '/get-proto-skills',
  validate(protoSkillParamsValidationChain),
  validate(paginationParamsValidationChain),
  getProtoSkills
)

// ... /app/proto-skill/create-proto-skill
protoSkillRoutes.post(
  '/create-proto-skill',
  requireSpecificRole('admin'),
  validate(protoSkillValidationChain),
  createProtoSkill
)

// ... /app/proto-skill/edit-proto-skill/:id
protoSkillRoutes.patch(
  '/edit-proto-skill/:id',
  requireSpecificRole('admin'),
  validate(protoSkillValidationChain),
  editProtoSkill
)

// ... /app/proto-skill/delete-proto-skill/:id
protoSkillRoutes.delete(
  '/delete-proto-skill/:id', 
  requireSpecificRole('admin'),
  deleteProtoSkill
)

export default protoSkillRoutes
