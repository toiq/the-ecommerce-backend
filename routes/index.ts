import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import profileRouter from "./profileRouter.js";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/profile", profileRouter);

export default rootRouter;
