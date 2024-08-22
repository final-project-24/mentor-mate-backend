import { Router } from "express";
import testRoutes from "./testRoutes.js";
import userRoutes from "./userRoutes.js";
import protoSkillRoutes from "./protoSkillRouter.js";
import skillCategoryRoutes from "./skillCategoryRouter.js";
import calendarRoutes from "./calendarRouter.js";
import sessionRoutes from "./sessionRouter.js";
import feedbackRoutes from "./feedbackRouter.js";
import bookingRoutes from "./bookingRouter.js";

const appRouter = Router();

appRouter.use("/test", testRoutes);

appRouter.use("/user", userRoutes);

appRouter.use("/proto-skill", protoSkillRoutes)

appRouter.use("/skill-category", skillCategoryRoutes)

appRouter.use("/calendar", calendarRoutes);

appRouter.use("/booking", bookingRoutes);

appRouter.use("/session", sessionRoutes);

appRouter.use("/feedback", feedbackRoutes);

export default appRouter;
