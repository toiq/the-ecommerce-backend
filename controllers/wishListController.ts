// wishlistController.ts
import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { NotFoundException } from "../exceptions/not-found.js";

import { ErrorCode } from "../exceptions/root.js";
import {
  AddToWishlistSchema,
  RemoveFromWishlistSchema,
} from "../schema/wishListSchema.js";

// Get wishlist for authenticated user
export const getWishlist = async (req: Request, res: Response) => {
  const wishlist = await prismaClient.profile.findUnique({
    where: {
      userId: req.user.id,
    },
    select: {
      wishlist: true,
    },
  });

  if (!wishlist) {
    throw new NotFoundException(
      "Wishlist not found",
      ErrorCode.WISHLIST_NOT_FOUND
    );
  }

  res.status(200).json({
    success: true,
    wishlist: wishlist.wishlist,
  });
};

// Add product to wishlist
export const addToWishlist = async (req: Request, res: Response) => {
  const data = AddToWishlistSchema.parse(req.body);

  const product = await prismaClient.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const updatedProfile = await prismaClient.profile.update({
    where: {
      userId: req.user.id,
    },
    data: {
      wishlist: {
        connect: { id: data.productId },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist: updatedProfile,
  });
};

// Remove product from wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
  const data = RemoveFromWishlistSchema.parse(req.body);

  const profile = await prismaClient.profile.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!profile) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const updatedProfile = await prismaClient.profile.update({
    where: {
      userId: req.user.id,
    },
    data: {
      wishlist: {
        disconnect: { id: data.productId },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist: updatedProfile,
  });
};
