import { Request, Response, NextFunction } from "express";
import { multerUpload } from "../utils/multer.js";

export const localUploadMiddleware = (fieldName: string) => {
  const singleUpload = multerUpload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    singleUpload(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (req?.file) {
        // Set the file URL in the request object
        req.fileUrl = `/uploads/${req.file.filename}`;
      }

      next();
    });
  };
};
