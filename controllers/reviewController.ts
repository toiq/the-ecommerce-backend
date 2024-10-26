import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { ReviewSchema, UpdateReviewSchema } from "../schema/reviewSchema.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { NotFoundException } from "../exceptions/not-found.js";

// Get reviews by product
export const getReviews = async (req: Request, res: Response) => {
  const { productId } = req.params;

  const reviews = await prismaClient.reviews.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    reviews,
  });
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  const data = ReviewSchema.parse(req.body);

  const existingReview = await prismaClient.reviews.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId: req.params.productId,
      },
    },
  });

  if (existingReview) {
    throw new BadRequestException(
      "You have already reviewed this product.",
      ErrorCode.REVIEW_ALREADY_EXISTS
    );
  }

  const newReview = await prismaClient.reviews.create({
    data: {
      ...data,
      userId: req.user.id,
      productId: req.params.productId,
    },
  });

  // Calculate the new average rating
  const { _avg } = await prismaClient.reviews.aggregate({
    where: { productId: req.params.productId },
    _avg: { rating: true },
  });

  // Update the product with the new average rating
  await prismaClient.product.update({
    where: { id: req.params.productId },
    data: { avgRating: _avg.rating || 0 }, // Set to 0 if no ratings exist
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully.",
    review: newReview,
  });
};

// Update an existing review
export const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const data = UpdateReviewSchema.parse(req.body);

  const review = await prismaClient.reviews.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review || review.userId !== req.user.id) {
    throw new NotFoundException(
      "Review not found or you do not have permission to update it.",
      ErrorCode.REVIEW_NOT_FOUND
    );
  }

  const updatedReview = await prismaClient.reviews.update({
    where: {
      id: reviewId,
    },
    data,
  });

  // Calculate the new average rating
  const { _avg } = await prismaClient.reviews.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
  });

  // Update the product with the new average rating
  await prismaClient.product.update({
    where: { id: review.productId },
    data: { avgRating: _avg.rating || 0 }, // Set to 0 if no ratings exist
  });

  res.status(200).json({
    success: true,
    message: "Review updated successfully.",
    review: updatedReview,
  });
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  const review = await prismaClient.reviews.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review || review.userId !== req.user.id) {
    throw new NotFoundException(
      "Review not found or you do not have permission to delete it.",
      ErrorCode.REVIEW_NOT_FOUND
    );
  }

  await prismaClient.reviews.delete({
    where: {
      id: reviewId,
    },
  });

  // Calculate the new average rating
  const { _avg } = await prismaClient.reviews.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
  });

  // Update the product with the new average rating
  await prismaClient.product.update({
    where: { id: review.productId },
    data: { avgRating: _avg.rating || 0 }, // Set to 0 if no ratings exist
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
  });
};
