// // dbMiddleware.ts

// // Imports ==============================================

// import { Request, Response, NextFunction } from "express";
// import db from "../db.js";

// // Middleware ===========================================

// export const dbMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Attempt to connect to the database using the request object
//     // This allows the connect function to extract the x-database-name header and establish a connection accordingly
//     await db.connect(req);

//     next();
//   } catch (error) {
//     console.error(`❌ Error connecting to the database: ${error}`);
//     res.status(500).send("Failed to connect to the database");
//   }
// };
