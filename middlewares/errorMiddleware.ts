import { HttpException } from "../exceptions/root.js";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};

export default errorMiddleware;
