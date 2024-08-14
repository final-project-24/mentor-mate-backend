import { Request, Response } from 'express';
import Feedback from '../models/feedbackModel.js';

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const feedbackData = req.body;
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
};

