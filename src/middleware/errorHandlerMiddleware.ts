// errorHandlerMiddleware.ts
// A middleware function that catches errors and sends a response to the client.

// Imports ========================================
import { Request, Response, NextFunction } from "express";

// Error handler middleware ========================
export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error for debugging purposes

  const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
  const message = err.message || "Something went wrong on the server."; // Default error message

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  }); // Send the error response to the client
};
