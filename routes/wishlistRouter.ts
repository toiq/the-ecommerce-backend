// wishlistRouter.ts
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import errorHandler from "../handlers/error-handler.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishListController.js";

const wishlistRouter: Router = Router();

// Get wishlist items
wishlistRouter.get("/", [authMiddleware("ACCESS")], errorHandler(getWishlist));

// Add product to wishlist
wishlistRouter.post(
  "/",
  [authMiddleware("ACCESS")],
  errorHandler(addToWishlist)
);

// Remove product from wishlist
wishlistRouter.delete(
  "/",
  [authMiddleware("ACCESS")],
  errorHandler(removeFromWishlist)
);

export default wishlistRouter;
