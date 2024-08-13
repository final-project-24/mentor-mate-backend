// testModel.ts

import mongoose from "mongoose";

export const testSchema = new mongoose.Schema(
  {
    textField: {
      type: String,
      required: true,
      trim: true, // Automatically trims whitespace
    },
    numberField: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const testModel = mongoose.model("Test", testSchema, "tests");

export default testModel;
