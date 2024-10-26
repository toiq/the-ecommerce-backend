import { z } from "zod";

export const ReviewSchema = z.object({
  comment: z.string().optional(),
  rating: z.number().min(1).max(5),
});

export const UpdateReviewSchema = z.object({
  comment: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});
