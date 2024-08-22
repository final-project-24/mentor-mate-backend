import { Router } from "express";
import testRoutes from "./testRoutes.js";
import userRoutes from "./userRoutes.js";
import protoSkillRoutes from "./protoSkillRouter.js";
import skillCategoryRoutes from "./skillCategoryRouter.js";
import userSkillRoutes from "./userSkillRouter.js";
import skillRoutes from "./skillRouter.js";
import calendarRoutes from "./calendarRouter.js";
import sessionRoutes from "./sessionRouter.js";
import feedbackRoutes from "./feedbackRouter.js";
import bookingRoutes from "./bookingRouter.js";

const appRouter = Router();

appRouter.use("/test", testRoutes);

appRouter.use("/user", userRoutes);

appRouter.use("/proto-skill", protoSkillRoutes)

appRouter.use("/skill-category", skillCategoryRoutes)

// ! the user-skill routes are disabled because the model and controller is not ready
// appRouter.use("/user-skill", userSkillRoutes)

appRouter.use("/skill", skillRoutes)

appRouter.use("/calendar", calendarRoutes);

appRouter.use("/booking", bookingRoutes);

appRouter.use("/session", sessionRoutes);

appRouter.use("/feedback", feedbackRoutes);

export default appRouter;
