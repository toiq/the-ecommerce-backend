import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { CreateBrandSchema, UpdateBrandSchema } from "../schema/brandSchema.js";

// Get all brands
export const getBrands = async (req: Request, res: Response) => {
  const brands = await prismaClient.brand.findMany({
    include: {
      products: true, // Include related products
    },
  });

  res.status(200).json({
    success: true,
    brands,
  });
};

// Get a single brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  const { brandId } = req.params;

  const brand = await prismaClient.brand.findUnique({
    where: {
      id: brandId,
    },
    include: {
      products: true, // Include related products if needed
    },
  });

  if (!brand) {
    throw new NotFoundException("Brand not found", ErrorCode.BRAND_NOT_FOUND);
  }

  res.status(200).json({
    success: true,
    brand,
  });
};

// Create a new brand
export const createBrand = async (req: Request, res: Response) => {
  const data = CreateBrandSchema.parse(req.body);

  const existingBrand = await prismaClient.brand.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingBrand) {
    throw new BadRequestException(
      "Brand already exists",
      ErrorCode.BRAND_ALREADY_EXISTS
    );
  }

  const brand = await prismaClient.brand.create({
    data,
  });

  res.status(201).json({
    success: true,
    message: "Brand created successfully.",
    brand,
  });
};

// Update an existing brand
export const updateBrand = async (req: Request, res: Response) => {
  const { brandId } = req.params;
  const data = UpdateBrandSchema.parse(req.body);

  const brand = await prismaClient.brand.findUnique({
    where: {
      id: brandId,
    },
  });

  if (!brand) {
    throw new NotFoundException("Brand not found", ErrorCode.BRAND_NOT_FOUND);
  }

  const updatedBrand = await prismaClient.brand.update({
    where: {
      id: brandId,
    },
    data,
  });

  res.status(200).json({
    success: true,
    message: "Brand updated successfully.",
    brand: updatedBrand,
  });
};

// Delete a brand
export const deleteBrand = async (req: Request, res: Response) => {
  const { brandId } = req.params;

  const brand = await prismaClient.brand.findUnique({
    where: {
      id: brandId,
    },
  });

  if (!brand) {
    throw new NotFoundException("Brand not found", ErrorCode.BRAND_NOT_FOUND);
  }

  await prismaClient.brand.delete({
    where: {
      id: brandId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully.",
  });
};
