import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { ChangePasswordSchema } from "../schema/userSchema.js";
import {
  compareHashedPassword,
  generateHashedPassword,
} from "../utils/hash.js";

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = ChangePasswordSchema.parse(req.body);
  const user = await prismaClient.user.findFirstOrThrow({
    where: {
      id: req.user.id,
    },
  });

  if (!(await compareHashedPassword(oldPassword, user?.password))) {
    throw new BadRequestException(
      "Password is incorrect.",
      ErrorCode.INCORRECT_CREDENTIALS
    );
  }

  const hashedPassword = await generateHashedPassword(newPassword);
  await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
};
