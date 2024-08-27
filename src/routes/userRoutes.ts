// Imports ==============================================

import express from "express";
import { verifyToken } from "../middleware/verifyTokenMiddleware.js";
import { validate } from "../middleware/validatorMiddleware.js";
import {
  signupValidator,
  loginValidator,
} from "../middleware/validationChains/authValidationChain.js";
import {
  getUsers,
  userLogin,
  userSignup,
  verifyUserAuth,
  userLogout,
  // updateUser,
  deleteUser,
  initiatePasswordReset,
  validateResetToken,
  updatePassword,
  updateUserRole,
  changeUserName,
  changePassword,
  changeEmail,
} from "../controllers/userController.js";

// Routes =================================================

const userRoutes = express.Router();

// http://localhost:4000/app/user/get-users/
userRoutes.get("/get-users", verifyToken, getUsers);

// http://localhost:4000/app/user/signup/
userRoutes.post("/signup", validate(signupValidator), userSignup);

// http://localhost:4000/app/user/login/
userRoutes.post("/login", validate(loginValidator), userLogin);

// http://localhost:4000/app/user/auth/
userRoutes.get("/auth", verifyToken, verifyUserAuth);

// http://localhost:4000/app/user/logout/
userRoutes.get("/logout", verifyToken, userLogout);

// http://localhost:4000/app/user/:id
// userRoutes.post("/update/:id", verifyToken, updateUser);

// http://localhost:4000/app/user/:id
// userRoutes.delete("/:id", verifyToken, deleteUser);
userRoutes.delete("/", verifyToken, deleteUser);

// http://localhost:4000/app/user/forgot-password
userRoutes.post("/forgot-password", initiatePasswordReset);

// http://localhost:4000/app/user/reset-password/:token
userRoutes.get("/reset-password/:token", validateResetToken);

// http://localhost:4000/app/user/reset-password/:token
userRoutes.post("/reset-password/:token", updatePassword);

// http://localhost:4000/app/user/update-role
userRoutes.put("/update-role", verifyToken, updateUserRole);

// http://localhost:4000/app/user/change-username
userRoutes.post("/change-username", verifyToken, changeUserName);

// http://localhost:4000/app/user/change-password
userRoutes.put("/change-password", verifyToken, changePassword);

// http://localhost:4000/app/user/change-email
userRoutes.put("/change-email", verifyToken, changeEmail);

// Exports ==============================================

export default userRoutes;
