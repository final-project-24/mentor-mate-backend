import express from 'express';
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'; 
import { getSession } from '../controllers/sessionController.js'; 

const sessionRouter = express.Router();

sessionRouter.get('/session', verifyToken, getSession);

export default sessionRouter;
