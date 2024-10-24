import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorCode, HttpException } from "../exceptions/root.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { InternalException } from "../exceptions/internal.js";

const errorHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      let exception;
      if (error instanceof HttpException) {
        exception = error;
      } else if (error instanceof ZodError) {
        exception = new BadRequestException(
          "Unprocessable entity.",
          ErrorCode.UNPROCESSABLE_ENTITY,
          error
        );
      } else {
        exception = new InternalException(
          "Something went wrong",
          ErrorCode.INTERNAL_SERVER_ERROR,
          error
        );
      }

      next(exception);
    }
  };
};

export default errorHandler;
