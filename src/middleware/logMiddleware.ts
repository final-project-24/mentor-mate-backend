// logMiddleware.ts
// Middleware function for detailed logging of incoming requests and responses
// ❌ ✅ 🔎 🌐 🔄 🔌❗👻❓📩🔑📬 : log emojis

// Imports =========================================

import { Request, Response, NextFunction } from "express"; // Import types (Typescript)

// Middleware ======================================

export const logMiddleware = (
  req: Request, // (ts syntax) Request object
  res: Response, // (ts syntax) Response object
  next: NextFunction // (ts syntax) Next function
) => {
  // Log all incoming requests
  const start = Date.now(); // Capture the start time of the request
  console.log(`📩 Incoming request: ${req.method} ${req.path} (logMiddleware.ts)`); // Log the HTTP method and path

  // Optionally log query parameters (consider privacy implications)
  console.log(`🔎 Query Parameters:`, req.query);

  // Log client IP address and User-Agent (consider privacy implications)
  // console.log(`🔎 Client IP: ${req.ip}`);
  // console.log(`🔎 User-Agent: ${req.headers["user-agent"]}`);

  // Log the request body
  console.log(`🔎 Request Body:`, req.body); // Log the request body
  // console.log("❓ Request Body Preview Disabled"); // Log a message indicating that the preview is disabled

  // Enhanced logging for request headers, including conditional logging for specific headers
  const databaseName = req.headers["x-database-name"]; // Extract the x-database-name header

  // console.log("🔎 Request Headers:", req.headers); // Log the entire request headers
  // console.log("❓ Request Headers Preview Disabled"); // Log a message indicating that the preview is disabled

  if (databaseName) {
    // console.log(`🔎 x-database-name: ${databaseName}`); // If the header exists, log its value
  } else {
    // console.log("🔎 No x-database-name header found"); // If the header does not exist, log that no header was found
  }

  // Log duration time of the request
  // Wrap the original res.send method to log when the response is sent
  const originalSend = res.send.bind(res); // Bind the original send method to the response object
  res.send = (...args) => {
    // Override the send method
    const duration = Date.now() - start; // Calculate the duration of the request
    console.log(
      `📬 Response sent for ${req.method} ${req.path} with status ${res.statusCode} in ${duration}ms (logMiddleware.ts)` // Log the response time
    );
    return originalSend(...args); // Call the original send method with all arguments
  };

  next(); // Proceed to the next middleware
};
