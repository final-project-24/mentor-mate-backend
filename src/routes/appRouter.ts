// appRouter
// main roue handler

// Imports =========================================
import { Router } from "express";
import testRoutes from "./testRoutes.js";
import userRoutes from "./userRoutes.js";
import skillRoutes from "./skillRouter.js";
import calendarRoutes from './calendarRouter.js';

// Routes ==========================================

const appRouter = Router();

appRouter.use("/test", testRoutes);

appRouter.use("/user", userRoutes);

appRouter.use("/skill", skillRoutes);

appRouter.use('/calendar', calendarRoutes);

// Exports =========================================

export default appRouter;
