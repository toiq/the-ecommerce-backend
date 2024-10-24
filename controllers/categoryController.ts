import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../schema/categorySchema.js";

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  const categories = await prismaClient.category.findMany({
    include: {
      products: true, // Include related products
    },
  });

  res.status(200).json({
    success: true,
    categories,
  });
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const category = await prismaClient.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      products: true, // Include related products if needed
    },
  });

  if (!category) {
    throw new NotFoundException(
      "Category not found",
      ErrorCode.CATEGORY_NOT_FOUND
    );
  }

  res.status(200).json({
    success: true,
    category,
  });
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  const data = CreateCategorySchema.parse(req.body);

  const existingCategory = await prismaClient.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new BadRequestException(
      "Category already exists",
      ErrorCode.CATEGORY_ALREADY_EXISTS
    );
  }

  const category = await prismaClient.category.create({
    data,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    category,
  });
};

// Update an existing category
export const updateCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const data = UpdateCategorySchema.parse(req.body);

  const category = await prismaClient.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new NotFoundException(
      "Category not found",
      ErrorCode.CATEGORY_NOT_FOUND
    );
  }

  const updatedCategory = await prismaClient.category.update({
    where: {
      id: categoryId,
    },
    data,
  });

  res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    category: updatedCategory,
  });
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const category = await prismaClient.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new NotFoundException(
      "Category not found",
      ErrorCode.CATEGORY_NOT_FOUND
    );
  }

  await prismaClient.category.delete({
    where: {
      id: categoryId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
};
