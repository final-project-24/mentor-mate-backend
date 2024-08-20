import { Router } from "express";
import testRoutes from "./testRoutes.js";
import userRoutes from "./userRoutes.js";
import skillRoutes from "./skillRouter.js";
import calendarRoutes from './calendarRouter.js';
import sessionRoutes from './sessionRouter.js';
import feedbackRoutes from './feedbackRouter.js';

const appRouter = Router();

appRouter.use("/test", testRoutes);
appRouter.use("/user", userRoutes);
appRouter.use("/skill", skillRoutes);
appRouter.use('/calendar', calendarRoutes);
appRouter.use('/session', sessionRoutes); 
appRouter.use('/feedback', feedbackRoutes);

export default appRouter;
