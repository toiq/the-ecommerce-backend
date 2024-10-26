import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import profileRouter from "./profileRouter.js";
import categoryRouter from "./categoryRouter.js";
import brandRouter from "./brandRouter.js";
import productRouter from "./productRouter.js";
import wishlistRouter from "./wishlistRouter.js";
import reviewRouter from "./reviewRouter.js";
import cartRouter from "./cartRouter.js";
import orderRouter from "./orderRouter.js";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/profile", profileRouter);
rootRouter.use("/profile/wishlist", wishlistRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/brands", brandRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/reviews", reviewRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/orders", orderRouter);

export default rootRouter;
