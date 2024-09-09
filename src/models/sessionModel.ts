// import { Schema, model } from 'mongoose';

// const sessionSchema = new Schema({
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   meetingLink: { type: String, required: true },
// }, { timestamps: true });

// const Session = model('Session', sessionSchema);

// export default Session;

import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  meetingLink: { type: String, required: true },
  start: { type: Date, required: true },
  status: { type: String, enum: ['booked', 'canceled'], default: 'booked' },
  canceledBy: { type: Schema.Types.ObjectId, ref: 'User' },
  freeSessionToken: { type: Boolean, default: false }
}, { timestamps: true });

const Session = model('Session', sessionSchema);

export default Session;




