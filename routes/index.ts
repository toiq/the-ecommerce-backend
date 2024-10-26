import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import profileRouter from "./profileRouter.js";
import categoryRouter from "./categoryRouter.js";
import brandRouter from "./brandRouter.js";
import productRouter from "./productRouter.js";
import wishlistRouter from "./wishlistRouter.js";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/profile", profileRouter);
rootRouter.use("/profile/wishlist", wishlistRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/brands", brandRouter);
rootRouter.use("/products", productRouter);

export default rootRouter;
