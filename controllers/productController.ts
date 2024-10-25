import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "../schema/productSchema.js";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  const products = await prismaClient.product.findMany({
    include: {
      brand: true,
      categories: true, // Include related categories if needed
      reviews: true, // Include related reviews if needed
    },
  });

  res.status(200).json({
    success: true,
    products,
  });
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      brand: true,
      categories: true,
      reviews: true,
    },
  });

  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  res.status(200).json({
    success: true,
    product,
  });
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  const data = CreateProductSchema.parse(req.body);

  const image = req.fileUrls?.["product-image"] || null;

  const product = await prismaClient.product.create({
    data: {
      ...data,
      categories: {
        connect: data.categories?.map((c) => ({ id: c })),
      },
      ...(image && { image }),
    },
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product,
  });
};

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const data = UpdateProductSchema.parse(req.body);

  const image = req.fileUrls?.["product-image"] || null;

  const product = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const updatedProduct = await prismaClient.product.update({
    where: {
      id: productId,
    },
    data: {
      ...product,
      ...data,
      categories: {
        connect: data.categories?.map((cId) => ({ id: cId })),
      },
      ...(image && { image }),
    },
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product: updatedProduct,
  });
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  await prismaClient.product.delete({
    where: {
      id: productId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
};
