// Imports =========================================

import bcrypt from "bcryptjs"; // Hashing passwords
import { Request, Response, NextFunction } from "express"; // Import types (Typescript)

import crypto from "crypto";
import nodemailer from "nodemailer";

// Models ------------------------------------------

import userModel from "../models/userModel.js";
import { COOKIE_NAME, BASE_URL, PORT, DOMAIN, BACKEND_URL, EMAIL_USER, EMAIL_PASS } from "../utils/config.js";
import { setAuthCookie } from "../utils/authHelpers.js";
import { errorHandlerMiddleware } from "../middleware/errorHandlerMiddleware.js";

// Controller functions ============================

// Get users -------------------------------------

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel.find();
    console.log("✅ Successfully retrieved users");
    return res.status(200).json({ details: "All Users:", users });
  } catch (error) {
    console.log("❌ Error retrieving users:", error);
    return res.status(500).json({ details: "ERROR:", cause: error.message });
  }
};

// Signup -----------------------------------------

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, email, password, role, image } = req.body; // Extract user details from request body

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered"); // Check if the user already exists

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const userProfileImage = image || `${BACKEND_URL}/images/avatar.svg`; // Default image

    const user = new userModel({
      userName,
      email,
      password: hashedPassword,
      role,
      image: userProfileImage,
    }); // Create a new user instance

    await user.save(); // Save user to database

    setAuthCookie(res, user._id.toString(), user.email, user.role); // create token and store cookie (/utils/authHelpers.ts)

    console.log("✅ User signup successful:", user);
    return res.status(201).json({
      message: "New User",
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      image: user.image,
    }); // Send success response
  } catch (error) {
    console.log("❌ Error during user signup:", error);
    return res.status(200).json({ message: "ERROR", cause: error.message }); // Send error response
  }
};

// Login ------------------------------------------

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ User not registered");
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("❌ Incorrect Password");
      return res.status(403).send("Incorrect Password");
    }

    setAuthCookie(res, user._id.toString(), user.email, user.role); // create token and store cookie (/utils/authHelpers.ts)

    console.log("✅ User login successful:", user);
    return res.status(200).json({
      message: "Welcome Back",
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.log("❌ Error during user login:", error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

// Verify user auth ------------------------------------

export const verifyUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) {
      console.log("❌ Authentication failed: User not found");
      return res.status(401).json({ message: "Authentication failed" });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      console.log("❌ Authentication failed: User ID mismatch");
      return res.status(401).json({ message: "Authentication failed" });
    }

    console.log(
      `🔑 User verified: ${user.userName} (ID: ${user._id}) (src/controller/userController.ts - verifyUserAuth)`
    );

    return res.status(200).json({
      message: "User Verified",
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.error("❌ Error verifying user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", cause: error.message });
  }
};

// Logout -----------------------------------------
// here we use the error middleware to test the error handling - feel to apply this to other routes

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Test the error middleware with query parameter
    if (req.query.testError) {
      throw new Error("Test Error: Checking error handling middleware");
    }

    const user = await userModel.findById(res.locals.jwtData.id);
    if (!user) {
      console.log("❌ Authentication failed: User not found");
      return res.status(401).json({ message: "Authentication failed" });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      console.log("❌ Authentication failed: User ID mismatch");
      return res.status(401).json({ message: "Authentication failed" });
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: DOMAIN,
      signed: true,
      path: "/",
    }); // Clear the auth cookie

    console.log("✅ User logout successful:", user);
    return res.status(200).json({
      message: "Logout successful",
      name: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Error during user logout:", error);
    next(error); // Use centralized error handling (/utils/errorHandlerMiddleware.ts)
  }
};

// delete user --------------------------------------

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = req.params.id; // Extract the user ID from the URL parameters
  const userId = req.userId; // Extract the user ID from the token - assuming verifyToken middleware adds userId to req

  if (!userId) {
    console.log("❌ User ID is required");
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const user = await userModel.findById(userId); // Check if the user exists

    if (!user) {
      console.log("❌ User doesn't exist");
      return res.status(404).json({ msg: "User doesn't exist" });
    }

    await userModel.findByIdAndDelete(userId); // Delete the user

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: DOMAIN,
      signed: true,
      path: "/",
    }); // Clear the auth cookie

    console.log("✅ User deleted successfully:", user);
    return res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return res.status(500).json({ msg: "Server error", cause: error.message });
  }
};

// Password Reset =====================================

export const initiatePasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Find the user by email
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      console.log("❌ No user found with that email address");
      return res.status(400).send("No user found with that email address.");
    }

    // 2. Generate a reset token and set its expiration
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await user.save(); // Save the user with the reset token and expiration

    // 3. Prepare the email content
    const resetURL = `http://${req.headers.host}/app/user/reset-password/${user.resetPasswordToken}`;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetURL}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", user);
    res.send("A password reset link has been sent to your email address.");
  } catch (err) {
    console.error("❌ Error in sending password reset email:", err);
    res.status(500).send("Error in sending password reset email.");
  }
};

// Validate reset token
export const validateResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Find user with valid token
    const user = await userModel.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Token must be valid (not expired)
    });

    if (!user) {
      console.log("❌ Password reset token is invalid or has expired");
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    // 2. Render the password reset form
    console.log("✅ Password reset token validated:", user);
    res.send(`<form action="/app/user/reset-password/${req.params.token}" method="POST">
      <input type="hidden" name="token" value="${req.params.token}" />
      <input type="password" name="password" placeholder="Enter your new password" required />
      <input type="password" name="confirmPassword" placeholder="Confirm your new password" required />
      <button type="submit">Reset Password</button>
    </form>`);
  } catch (err) {
    console.error("❌ Error in validating reset token:", err);
    res.status(500).send("Error in validating reset token.");
  }
};

// Update password
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Password reset token is invalid or has expired");
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    if (req.body.password !== req.body.confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).send("Passwords do not match.");
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(
      `✅ Password updated for user: ${user.userName} (ID: ${user._id})`
    );

    res.send("Your password has been updated.");
  } catch (err) {
    console.error("❌ Error in resetting password:", err);
    res.status(500).send("Error in resetting password.");
  }
};
