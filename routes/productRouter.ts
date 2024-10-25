import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";
import { createProduct } from "../controllers/productController.js";
import { cloudUploadMiddleware } from "../middlewares/cloudUploadMiddleware.js";

const productRouter: Router = Router();

productRouter.post(
  "/",
  [
    authMiddleware("ACCESS"),
    cloudUploadMiddleware(
      [
        {
          name: "file",
          optional: true,
        },
      ],
      "products"
    ),
  ],
  errorHandler(createProduct)
);

export default productRouter;
