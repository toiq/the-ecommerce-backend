import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const categoryRouter: Router = Router();

// Get all categories
categoryRouter.get(
  "/",
  [authMiddleware("ACCESS")],
  errorHandler(getCategories)
);

// Get a single category by ID
categoryRouter.get(
  "/:categoryId",
  [authMiddleware("ACCESS")],
  errorHandler(getCategoryById)
);

// Create a new category
categoryRouter.post(
  "/",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(createCategory)
);

// Update a category
categoryRouter.put(
  "/:categoryId",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(updateCategory)
);

// Delete a category
categoryRouter.delete(
  "/:categoryId",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(deleteCategory)
);

export default categoryRouter;
