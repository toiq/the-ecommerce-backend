// cartSchema.ts
import { z } from "zod";

// Validator for adding an item to the cart
export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Validator for updating the quantity of an item in the cart
export const UpdateCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Validator for removing an item from the cart
export const RemoveFromCartSchema = z.object({
  productId: z.string(),
});
