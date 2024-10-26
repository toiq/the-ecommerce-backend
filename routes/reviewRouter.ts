import { Router } from "express";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../handlers/error-handler.js";

// Create a router instance
const reviewRouter: Router = Router();

// Get all reviews for a specific product
reviewRouter.get(
  "/:productId",
  authMiddleware("ACCESS"),
  errorHandler(getReviews)
);

// Create a new review for a specific product
reviewRouter.post(
  "/:productId",
  authMiddleware("ACCESS"),
  errorHandler(createReview)
);

// Update an existing review
reviewRouter.put(
  "/:reviewId",
  authMiddleware("ACCESS"),
  errorHandler(updateReview)
);

// Delete a review
reviewRouter.delete(
  "/:reviewId",
  authMiddleware("ACCESS"),
  errorHandler(deleteReview)
);

// Export the review router
export default reviewRouter;
