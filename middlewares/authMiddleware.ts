import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import prismaClient from "../dbclients/prismaClient.js";
import { env } from "../config/env.js";

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

      console.log({ payload });
      const user = await prismaClient.user.findFirst({
        where: { id: payload.id },
      });

      console.log({ payload, user });

      if (!user) {
        return next(
          new UnauthorizedException(
            "Unauthorized",
            ErrorCode.UNAUTHORIZED_ACCESS
          )
        );
      } else {
        req.user = user;
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
