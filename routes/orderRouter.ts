// orderRouter.ts
import { Router } from "express";
import {
  createOrder,
  getOrders,
  updateOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

// Create a router instance
const orderRouter: Router = Router();

// Get orders
orderRouter.get("/", authMiddleware("ACCESS"), errorHandler(getOrders));

// Create a new order
orderRouter.post("/", authMiddleware("ACCESS"), errorHandler(createOrder));

// Update an existing order status
orderRouter.put(
  "/",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(updateOrder)
);

// Export the order router
export default orderRouter;
