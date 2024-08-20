import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  strengths: { type: String },
  improvement: { type: String },
  publicFeedback: { type: Boolean, required: true },
  rating: { type: Number },
  additionalComment: { type: String }, 
  isMentor: { type: Boolean, required: true },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;