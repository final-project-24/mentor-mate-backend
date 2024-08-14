import { Request, Response } from 'express';
import Session from '../models/sessionModel.js';

export const getSession = async (req: Request, res: Response) => {
  try {
    // For demo purposes, fetch one session or customize as needed
    const session = await Session.findOne(); 
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
