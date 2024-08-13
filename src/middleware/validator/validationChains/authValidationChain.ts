import { body } from 'express-validator'

// Login Validation Chain --------------------------------

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password should contain at least 4 characters"),
];

// Signup Validation Chain -------------------------------

export const signupValidator = [
  body("userName").notEmpty().withMessage("Name is required"),
  // emailNotExistsValidator,
  ...loginValidator,
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];
