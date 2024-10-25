import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { cloudUploadMiddleware } from "../middlewares/cloudUploadMiddleware.js";

const productRouter: Router = Router();

// Get all products
productRouter.get("/", errorHandler(getProducts));

// Get a single product by ID
productRouter.get("/:productId", errorHandler(getProductById));

// Create a new product
productRouter.post(
  "/",
  [
    authMiddleware("ACCESS"),
    adminMiddleware,
    cloudUploadMiddleware(
      [
        {
          name: "product-image",
        },
      ],
      "products"
    ),
  ],
  errorHandler(createProduct)
);

// Update a product
productRouter.put(
  "/:productId",
  [
    authMiddleware("ACCESS"),
    adminMiddleware,
    cloudUploadMiddleware(
      [
        {
          name: "product-image",
        },
      ],
      "products"
    ),
  ],
  errorHandler(updateProduct)
);

// Delete a product
productRouter.delete(
  "/:productId",
  [authMiddleware("ACCESS"), adminMiddleware],
  errorHandler(deleteProduct)
);

export default productRouter;
