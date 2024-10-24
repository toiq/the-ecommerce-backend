import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";
import { changePassword } from "../controllers/userController.js";

const userRouter: Router = Router();

// Change password
userRouter.post(
  "/change-password/",
  [authMiddleware("ACCESS")],
  errorHandler(changePassword)
);

export default userRouter;
