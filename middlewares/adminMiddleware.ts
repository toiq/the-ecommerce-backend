import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role === "ADMIN") {
    return next();
  } else {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
    );
  }
};

export default adminMiddleware;
