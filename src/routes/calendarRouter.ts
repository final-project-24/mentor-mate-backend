import express from 'express';
import { verifyToken } from '../middleware/verifyTokenMiddleware.js';
import { getMentorAvailability, addCalendarEvent, bookCalendarEvent } from '../controllers/calendarController.js';

const calendarRoutes = express.Router();

calendarRoutes.get('/:mentorId', verifyToken, getMentorAvailability);
calendarRoutes.post('/', verifyToken, addCalendarEvent);
calendarRoutes.post('/book/:id', verifyToken, bookCalendarEvent);

export default calendarRoutes;
