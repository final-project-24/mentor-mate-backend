// /utils/config.ts
// Load environment variables and set defaults

// db.ts
export const MONGODB_URI = process.env.MONGODB_URI;

// db.ts
export const DEFAULT_DB_NAME = process.env.DEFAULT_DB_NAME || "dev";

// verifyTokenMiddleware.ts / authHelpers.ts
export const JWT_SECRET = process.env.JWT_SECRET;

// app.ts
export const COOKIE_SECRET = process.env.COOKIE_SECRET;

// authHelpers.ts / verifyTokenMiddleware.ts / userController.ts (Logout)
export const COOKIE_NAME = process.env.COOKIE_NAME || "jwt-auth-cookie";

// authHelpers.ts
export const DOMAIN = process.env.DOMAIN || "localhost";

export const BASE_URL = process.env.BASE_URL || "http://localhost:"; // not used

// index.ts
export const PORT = process.env.PORT || 4000;

// userController.ts (Signup)
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000"; // new

// app.ts
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// userController.ts (Password Reset)
export const EMAIL_USER = process.env.EMAIL_USER;

// userController.ts (Password Reset)
export const EMAIL_PASS = process.env.EMAIL_PASS;
