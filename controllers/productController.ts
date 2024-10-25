import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    url: req.fileUrls,
  });
};
