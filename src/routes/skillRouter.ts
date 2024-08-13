import express from 'express'
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import { 
  addSkillToUser, 
  createSkill,
  deleteSkill,
  getSkills,
} from '../controllers/skillController.js';

const skillRoutes = express.Router()

// .../app/skill/get-skills
skillRoutes.get('/get-skills', verifyToken, getSkills)

// .../app/skill/create-skill
skillRoutes.post('/create-skill', verifyToken, createSkill)

// .../app/skill/delete-skill
skillRoutes.delete('/delete-skill', verifyToken, deleteSkill)

// .../app/skill/add-skill-to-user
skillRoutes.post('/add-skill-to-user', verifyToken, addSkillToUser)

export default skillRoutes
