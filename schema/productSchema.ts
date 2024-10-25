import { z } from "zod";

// Schema for creating a product
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  stock: z.number().min(0, "Stock must be at least 0"),
  price: z.number().min(0, "Price must be at least 0"),
  desc: z.string().min(1, "Description is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  categories: z.array(z.string()).optional(), // Array of category IDs
  image: z.string().optional(), // Optional image URL
});

// Schema for updating a product
export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  stock: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  desc: z.string().min(1).optional(),
  brandId: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  image: z.string().optional(),
});
