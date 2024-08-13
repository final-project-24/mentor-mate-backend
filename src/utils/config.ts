// /utils/config.ts
// Load environment variables and set defaults

// db.ts
export const MONGODB_URI = process.env.MONGODB_URI;

// db.ts
export const DEFAULT_DB_NAME = process.env.DEFAULT_DB_NAME || "dev";

// tokenMiddleware.ts
export const JWT_SECRET = process.env.JWT_SECRET;

// app.ts
export const COOKIE_SECRET = process.env.COOKIE_SECRET;

// authHelpers.ts / tokenMiddleware.ts / userController.ts (Logout)
export const COOKIE_NAME = process.env.COOKIE_NAME || "jwt-auth-cookie";

// authHelpers.ts
export const DOMAIN = process.env.DOMAIN || "localhost";

// userController.ts (Signup)
export const BASE_URL = process.env.BASE_URL || "http://localhost:";

// index.ts / userController.ts (Signup)
export const PORT = process.env.PORT || 4000;

// app.ts
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
