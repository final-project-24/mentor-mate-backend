// Imports =========================================

import mongoose from "mongoose";
import { NODE_ENV } from "../utils/config.js";

// Schema ==========================================

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    image: String,
    role: {
      type: String,
      required: true,
      enum: ['admin', 'mentor', 'mentee']
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        default: [],
      },
    ],
    // Add these fields for password reset functionality
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to remove confirmPassword before saving
userSchema.pre("save", async function (next) {
  this.confirmPassword = undefined; // pre() method is used to delete the confirmPassword before saving it to the database
  next();
});

const userModel = mongoose.model("User", userSchema, "users");

// Export ==========================================

export default userModel;

