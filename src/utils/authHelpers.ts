// utils/authHelpers.ts
// a helper function that sets the authentication cookie.

// Imports ========================================

import { Response } from "express"; // Typescript types
import { createToken } from "./tokenMiddleware.js";
import { COOKIE_NAME, DOMAIN } from "./config.js";

// Set the authentication cookie =================

export const setAuthCookie = (res: Response, userId: string, email: string, role: string ) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    domain: DOMAIN,
    signed: true,
    path: "/",
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
  }); // Set the cookie with the new token
};
