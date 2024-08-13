// src/types/types.d.ts

import { Request } from "express";

// Augment the Request interface to include a userId property

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Use '?' to make it optional since not all requests will have a userId
      userRole?: string; // Similarly, make userRole optional
    }
  }
}
