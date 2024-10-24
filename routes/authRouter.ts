import { Router } from "express";
import {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";
import errorHandler from "../handlers/error-handler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter: Router = Router();

// Register a new user
authRouter.post("/register", errorHandler(register));

// Verify email with token
authRouter.get("/verify/:token", errorHandler(verifyEmail));

// Resend verification email
authRouter.post("/resend-verification-email", errorHandler(resendVerifyEmail));

// Login a user
authRouter.post("/login", errorHandler(login));

// Refresh tokens
authRouter.post("/refresh", [authMiddleware("REFRESH")], errorHandler(refresh));

// Logout user
authRouter.post("/logout", [authMiddleware("REFRESH")], errorHandler(logout));

export default authRouter;
