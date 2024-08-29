// validators.ts
// A middleware that contains validation functions for user input.

// Imports =========================================

import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import userModel from "../models/userModel.js";
import Feedback from "../models/feedbackModel.js";

// Validate Function ===============================

// This function is a middleware generator for express.js that takes an array of ValidationChain objects.
export const validate = (validations: ValidationChain[]) => {
  // It returns an asynchronous middleware function.
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("🔑 Running validate function"); // Logs the start of the validation process.
    // Iterates over each validation in the validations array.
    for (let validation of validations) {
      await validation.run(req); // Runs the current validation against the request object.
    }
    const errors = validationResult(req); // After running all validations, checks for any validation errors.
    // If the errors object is not empty, it means validation errors were found.
    if (!errors.isEmpty()) {
      console.log("❌ Validation failed with errors:", errors.array()); // Logs the validation errors.
      return res.status(422).json({ error: errors.array() }); // Responds with a 422 Unprocessable Entity status code and the errors.
    }
    console.log("✅ Validation successful"); // If no errors were found, logs that validation was successful.
    next(); // Calls the next middleware in the stack.
  };
};

// Validations ======================================

// Email Validator --------------------------------

// const emailNotExistsValidator = body('email').custom(async (email) => {
//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) {
//     return Promise.reject('Email already in use');
//   }
// });

