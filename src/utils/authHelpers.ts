// utils/authHelpers.ts
// a helper function that sets the authentication cookie.

// Imports ========================================

import { Response } from "express"; // Typescript types
import { COOKIE_NAME, DOMAIN, JWT_SECRET, NODE_ENV } from "./config.js";
import jwt from "jsonwebtoken";

// Create a token =================================

export const createToken = (
  id: string,
  email: string,
  expiresIn: string,
  role: string
) => {
  console.log("🔑 Creating token (/utils/tokenMiddleware.ts)");
  const payload = { id, email, role };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
  return token;
};

// Set the authentication cookie =================

export const setAuthCookie = (
  res: Response,
  userId: string,
  email: string,
  role: string
) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    domain: DOMAIN,
    signed: true,
    path: "/",
    secure: NODE_ENV === "production", // Set secure flag in production
    // sameSite: NODE_ENV === "production" ? "none" : "lax", // Adjust sameSite attribute as needed: strict, lax, none
  }); // Clear the cookie before setting it again

  const token = createToken(userId, email, "7d", role); // Create a token that expires in 7 days
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // Add 7 days to the current date

  res.cookie(COOKIE_NAME, token, {
    path: "/",
    domain: DOMAIN,
    expires,
    httpOnly: true,
    signed: true,
    secure: NODE_ENV === "production", // Set secure flag in production
    // sameSite: NODE_ENV === "production" ? "none" : "lax", // Adjust sameSite attribute as needed: strict, lax, none
  }); // Set the cookie with the new token
};
