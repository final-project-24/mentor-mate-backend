import { Router } from "express";
import testRoutes from "./testRoutes.js";
import userRoutes from "./userRoutes.js";
import calendarRoutes from './calendarRouter.js';
import paymentRoutes from './paymentRouter.js';
import sessionRoutes from './sessionRouter.js';
import feedbackRoutes from './feedbackRouter.js';
import protoSkillRoutes from "./protoSkillRouter.js";
import userSkillRoutes from "./userSkillRouter.js";
import skillCategoryRoutes from "./skillCategoryRouter.js";
// import bookingRoutes from "./bookingRouter.js";


const appRouter = Router();

appRouter.use("/test", testRoutes);
appRouter.use("/user", userRoutes);
appRouter.use('/calendar', calendarRoutes);
appRouter.use('/payment', paymentRoutes);
appRouter.use('/session', sessionRoutes); 
appRouter.use('/feedback', feedbackRoutes);
appRouter.use("/proto-skill", protoSkillRoutes)
appRouter.use("/skill-category", skillCategoryRoutes)
// appRouter.use("/booking", bookingRoutes);


export default appRouter;
