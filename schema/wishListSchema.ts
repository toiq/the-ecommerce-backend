import { z } from "zod";

export const AddToWishlistSchema = z.object({
  productId: z.string(),
});

export const RemoveFromWishlistSchema = z.object({
  productId: z.string(),
});
