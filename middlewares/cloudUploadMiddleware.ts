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

      try {
        // Process each field individually
        for (const field of fields) {
          const file = req.files?.[field.name]?.[0];

          if (file) {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: `${env.CLOUDINARY_FOLDER_PREFIX}-${folder}`,
                use_filename: true,
                unique_filename: true,
              },
              (uploadError, result) => {
                if (uploadError) {
                  return res
                    .status(500)
                    .json({ error: "Cloudinary upload failed" });
                }
                // Store Cloudinary URL in fileUrls with field name as key
                if (result) {
                  if (req.fileUrls)
                    req.fileUrls[field.name] = result.secure_url;
                } else {
                  return next(
                    new BadRequestException(
                      "Failed to upload",
                      ErrorCode.FAILED_TO_UPLOAD
                    )
                  );
                }

                // If it's the last file being processed, call next()
                if (fields.indexOf(field) === fields.length - 1) {
                  next();
                }
              }
            );

            // Pipe the file buffer to Cloudinary's upload stream
            uploadStream.end(file.buffer);
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
