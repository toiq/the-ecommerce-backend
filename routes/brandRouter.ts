import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
  updateBrand,
} from "../controllers/brandController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const brandRouter: Router = Router();

// Get all categories
brandRouter.get("/", [authMiddleware("ACCESS")], errorHandler(getBrands));

// Get a single brand by ID
brandRouter.get(
  "/:brandId",
  [authMiddleware("ACCESS")],
  errorHandler(getBrandById)
);

// Create a new brand
brandRouter.post(
  "/",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(createBrand)
);

// Update a brand
brandRouter.put(
  "/:brandId",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(updateBrand)
);

// Delete a brand
brandRouter.delete(
  "/:brandId",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(deleteBrand)
);

export default brandRouter;
