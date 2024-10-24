import { z } from "zod";

export const CreateBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
});

export const UpdateBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
});
