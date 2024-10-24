import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import { env } from "../config/env.js";
import { getUserRefreshToken } from "../services/userService.js";

const authMiddleware =
  (tokenType: "ACCESS" | "REFRESH") =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
      );
    }

    try {
      const payload: any = jwt.verify(
        token!,
        tokenType === "ACCESS"
          ? env.ACCESS_TOKEN_SECRET
          : env.REFRESH_TOKEN_SECRET
      );

      const tokenCache = await getUserRefreshToken(payload.email);

      console.log({ payload });

      if (tokenCache !== token) {
        return next(
          new UnauthorizedException(
            "Unauthorized",
            ErrorCode.UNAUTHORIZED_ACCESS
          )
        );
      } else {
        req.user = payload;
        next();
      }
    } catch (error) {
      console.log({ error });
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
      );
    }
  };

export default authMiddleware;
