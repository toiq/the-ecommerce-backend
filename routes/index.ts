import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import profileRouter from "./profileRouter.js";
import categoryRouter from "./categoryRouter.js";
import brandRouter from "./brandRouter.js";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/profile", profileRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/brands", brandRouter);

export default rootRouter;
