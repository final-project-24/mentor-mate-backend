import { Router } from 'express';
import { searchMentors, getMentorSkills } from '../controllers/searchController.js';


const searchRoutes = Router();

searchRoutes.get('/', searchMentors);

searchRoutes.get('/mentor/:mentorUuid/skills', getMentorSkills);

export default searchRoutes;