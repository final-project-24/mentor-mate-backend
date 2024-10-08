// /utils/tokenMiddleware.ts
// a middleware that creates token and a
// middleware that verifies token and extracts data from the token payload.

// Imports ========================================

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, COOKIE_NAME } from "../utils/config.js";

// Verify a token =================================
// + extract the userId from the token payload
// + extract the userRole from the token payload (RBAC)

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`]; // Get the token from the cookie
  if (!token || token.trim() === "") {
    console.log("❌ Token Not Received");
    return res.status(401).json({ message: "Token Not Received" });
  }
  // Promise that resolves or rejects based on the token verification
  return new Promise<void>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("❌ Token verification failed:", err.message);
        reject(err.message); // Reject the promise
        return res.status(401).json({ message: "Token Expired" });
      } else {
        const userId = decodedToken.id; // Try to get the userId from the decoded token payload - Assuming the payload contains user ID as 'id'
        const userRole = decodedToken.role; // Extract the role from the decoded token payload

        req.userId = userId; // Attach userId to the request object for downstream use
        req.userRole = userRole; // Attach userRole to the request object for downstream use

        console.log(`🔑 User verified -  extracted data from token: ${userId} + ${userRole} (verifyTokenMiddleware)`);

        resolve(); // Resolve the promise
        res.locals.jwtData = decodedToken; // Attach the decoded token to the response object
        return next();
      }
    });
  });
};
