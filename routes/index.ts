import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);

export default rootRouter;
