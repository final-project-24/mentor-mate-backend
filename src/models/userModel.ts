// Imports =========================================

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // use uuidv4() to generate a unique id
import { NODE_ENV } from "../utils/config.js";

// Schema ==========================================

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    }, // Add a new field to store the unique id
    userName: {
      type: String,
      required: true,
    },
    userNameLower: {
      type: String
    }, // this userName prop is used internally in BE for comparison purposes
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
      enum: ["admin", "mentor", "mentee"],
    },
    originalRole: { type: String }, // New field to store the original role
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
  this.userNameLower = this.userName.toLowerCase()
  this.confirmPassword = undefined; // pre() method is used to delete the confirmPassword before saving it to the database
  next();
});

// ! set hook
// excludes model props from response object when using .json() method
userSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.userNameLower
    return ret
  }
})

const userModel = mongoose.model("User", userSchema, "users");

// Export ==========================================

export default userModel;
