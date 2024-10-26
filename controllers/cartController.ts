// cartController.ts
import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  RemoveFromCartSchema,
} from "../schema/cartSchema.js";
import { updateCartTotal } from "../services/cartService.js";

// Get cart for authenticated user
export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cart.findFirstOrThrow({
    where: {
      userId: req.user.id,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    cart: cart,
  });
};

// Add product to cart
export const addToCart = async (req: Request, res: Response) => {
  const data = AddToCartSchema.parse(req.body);

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

  const cart = await prismaClient.cart.findFirstOrThrow({
    where: {
      userId: req.user.id,
    },
  });

  const cartItem = await prismaClient.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
    update: {
      quantity: {
        increment: data.quantity,
      },
    },
    create: {
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity,
      price: product.price,
    },
  });

  // Update cart total after adding the product
  await updateCartTotal(cart.id);

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cartItem,
  });
};

// Update product quantity in cart
export const updateCartItem = async (req: Request, res: Response) => {
  const data = UpdateCartItemSchema.parse(req.body);

  const cart = await prismaClient.cart.findFirstOrThrow({
    where: {
      userId: req.user.id,
    },
  });

  const cartItem = await prismaClient.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Cart item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  const updatedCartItem = await prismaClient.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
    data: {
      quantity: data.quantity,
    },
  });

  // Update cart total after changing the item quantity
  await updateCartTotal(cart.id);

  res.status(200).json({
    success: true,
    message: "Cart item updated",
    cartItem: updatedCartItem,
  });
};

// Remove product from cart
export const removeFromCart = async (req: Request, res: Response) => {
  const data = RemoveFromCartSchema.parse(req.body);

  const cart = await prismaClient.cart.findFirstOrThrow({
    where: {
      userId: req.user.id,
    },
  });

  const cartItem = await prismaClient.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Cart item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  await prismaClient.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  // Update cart total after removing the product
  await updateCartTotal(cart.id);

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
  });
};
