import { Request, Response, NextFunction } from "express";
import { multerUpload } from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { env } from "../config/env.js";

interface FieldOptions {
  name: string;
  optional?: boolean;
}

export const cloudUploadMiddleware = (
  fields: FieldOptions[],
  folder: string = "uploads"
) => {
  const upload = multerUpload.fields(
    [...fields].map((field) => ({ name: field.name, maxCount: 1 }))
  );

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err: any) => {
      if (err) {
        return next(
          new BadRequestException(
            "Failed to upload.",
            ErrorCode.INTERNAL_SERVER_ERROR
          )
        );
      }

      req.fileUrls = {};

      const uploadPromises: Promise<void>[] = [];

      try {
        // Process each field individually
        for (const field of fields) {
          const file = req.files?.[field.name]?.[0];

          if (file) {
            const uploadPromise = new Promise<void>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: `${env.CLOUDINARY_FOLDER_PREFIX}-${folder}`,
                  use_filename: true,
                  unique_filename: true,
                },
                (uploadError, result) => {
                  if (uploadError) {
                    return reject(
                      new BadRequestException(
                        "Cloudinary upload failed",
                        ErrorCode.INTERNAL_SERVER_ERROR
                      )
                    );
                  }

                  // Store Cloudinary URL in fileUrls with field name as key
                  if (result && req.fileUrls) {
                    req.fileUrls[field.name] = result.secure_url;
                    resolve();
                  } else {
                    reject(
                      new BadRequestException(
                        "Failed to upload",
                        ErrorCode.FAILED_TO_UPLOAD
                      )
                    );
                  }
                }
              );

              // Pipe the file buffer to Cloudinary's upload stream
              uploadStream.end(file.buffer);
            });

            uploadPromises.push(uploadPromise);
          } else if (field.optional === false) {
            // Return error if a required field is missing
            return next(
              new BadRequestException(
                "You did not provide required file",
                ErrorCode.BAD_REQUEST
              )
            );
          }
        }

        // Wait for all uploads to finish
        await Promise.all(uploadPromises);

        // Call next only after all uploads have been processed
        next();
      } catch (uploadError) {
        return next(
          new BadRequestException(
            "Failed to upload",
            ErrorCode.FAILED_TO_UPLOAD
          )
        );
      }
    });
  };
};
