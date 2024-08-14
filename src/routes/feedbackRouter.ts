import express from 'express';
import { verifyToken } from '../middleware/verifyTokenMiddleware.js';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

// Route to submit feedback; protected by token verification
feedbackRouter.post('/', verifyToken, submitFeedback);

// Route to get all feedbacks; can be modified as needed (protected or public)
feedbackRouter.get('/', verifyToken, getFeedbacks);

export default feedbackRouter;







