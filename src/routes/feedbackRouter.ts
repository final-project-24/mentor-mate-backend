import express from 'express';
import { verifyToken } from '../middleware/verifyTokenMiddleware.js';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController.js';

const feedbackRoutes = express.Router();

// POST /feedback/ - Submit feedback (protected by token verification)
feedbackRoutes.post('/', verifyToken, submitFeedback);

// GET /feedback/ - Get all feedback (protected by token verification)
feedbackRoutes.get('/', verifyToken, getFeedbacks);

export default feedbackRoutes;







