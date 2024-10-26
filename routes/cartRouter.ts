import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";

// Create a router instance
const cartRouter: Router = Router();

// Get cart for authenticated user
cartRouter.get("/", authMiddleware("ACCESS"), errorHandler(getCart));

// Add product to cart
cartRouter.post("/", authMiddleware("ACCESS"), errorHandler(addToCart));

// Update cart item quantity
cartRouter.put("/", authMiddleware("ACCESS"), errorHandler(updateCartItem));

// Remove product from cart
cartRouter.delete("/", authMiddleware("ACCESS"), errorHandler(removeFromCart));

// Export the cart router
export default cartRouter;
