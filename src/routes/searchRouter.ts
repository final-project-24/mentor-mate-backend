import { Router } from 'express';
import { searchMentors, getMentorSkills, getMentorsByUuid } from '../controllers/searchController.js';


const searchRoutes = Router();

searchRoutes.get('/', searchMentors);

searchRoutes.get('/mentor/:mentorUuid/skills', getMentorSkills);

searchRoutes.post('/mentor/by-uuid', getMentorsByUuid);

export default searchRoutes;