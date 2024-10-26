// orderController.ts
import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { UpdateOrderSchema } from "../schema/orderSchema.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import { updateCartTotal } from "../services/cartService.js";

export const getOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      orderDetail: true, // Include order details such as products, quantities, etc.
      paymentDetail: true, // Optionally include payment details if needed
      trackOrder: true, // Optionally include tracking details if you want to show order status
    },
    orderBy: {
      time: "desc", // Order by the time of creation, newest first
    },
  });

  if (!orders || orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No orders found",
    });
  }

  res.status(200).json({
    success: true,
    orders,
  });
};

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  // Check if the user has a default address
  const user = await prismaClient.user.findUnique({
    where: { id: req.user.id },
    select: { profile: { select: { defaultAddress: true } } },
  });

  if (!user || !user.profile?.defaultAddress) {
    throw new NotFoundException(
      "User does not have a default address",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }

  // Fetch the cart and its items
  const cart = await prismaClient.cart.findUnique({
    where: { userId: req.user.id },
    include: { cartItems: true }, // Include cart items for order creation
  });

  if (!cart) {
    throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
  }

  // Check if the cart is empty
  if (cart.cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot create an order with an empty cart",
    });
  }

  // Calculate total price based on cart items
  const totalPrice = cart.cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Create an order
  const order = await prismaClient.order.create({
    data: {
      userId: req.user.id,
      total: totalPrice,
      address: user.profile.defaultAddress.id, // Use the default address ID
      orderDetail: {
        create: cart.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subTotal: item.price * item.quantity,
        })),
      },
    },
  });

  // Clear the cart by deleting the cart items
  await prismaClient.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  // Optionally, you might want to set the cart total to 0
  await updateCartTotal(cart.id);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
};

// Optional: Update order status (if you need it)
export const updateOrder = async (req: Request, res: Response) => {
  const data = UpdateOrderSchema.parse(req.body);

  const order = await prismaClient.order.findUnique({
    where: { id: data.orderId },
  });

  if (!order) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }

  const updatedOrder = await prismaClient.order.update({
    where: { id: data.orderId },
    data: {
      trackOrder: {
        update: { status: data.status },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order: updatedOrder,
  });
};
