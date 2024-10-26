// orderSchema.ts
import { z } from "zod";

// Zod schema for creating an order
export const CreateOrderSchema = z.object({
  address: z.string().min(1, "Address is required"),
  cartId: z.string().min(1, "Cart ID is required"),
});

// Zod schema for updating an order (if needed)
export const UpdateOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.enum(["PREPARING", "SHIPPED", "DELIVERD"]),
});
