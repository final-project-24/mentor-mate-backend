import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  meetingLink: { type: String, required: true },
}, { timestamps: true });

const Session = model('Session', sessionSchema);

export default Session;
