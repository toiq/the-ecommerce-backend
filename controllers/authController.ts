import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResendVerifyEmailSchema,
  ResetPasswordSchema,
} from "../schema/userSchema.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import {
  compareHashedPassword,
  generateHashedPassword,
} from "../utils/hash.js";
import {
  decodeVerificationToken,
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
  generateVerificationToken,
} from "../utils/jwt.js";
import { env } from "../config/env.js";
import {
  decodePasswordResetToken,
  deleteUserRefreshToken,
  deleteUserSignUpCache,
  getUserSignUpCache,
  setUserRefreshToken,
  setUserSignUpCache,
  updateUserPassword,
} from "../services/userService.js";
import { sendVerificationEmail } from "../utils/email.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = RegisterSchema.parse(req.body);
  const user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    throw new BadRequestException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  const hashedPassword = await await generateHashedPassword(password);
  const verificationToken = generateVerificationToken(email);
  const link = `${env.BACKEND_HOST}/api/auth/verify/${verificationToken}`;

  await setUserSignUpCache(email, {
    name: name,
    email: email,
    password: hashedPassword,
  });

  await sendVerificationEmail(email, link);

  res.status(201).json({
    success: true,
    message: `Verification link has been sent to ${email}`,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
  const { email: decodedEmail } = decodeVerificationToken(token);
  const userCache = await getUserSignUpCache(decodedEmail);

  if (!decodedEmail || decodedEmail !== userCache?.email) {
    throw new BadRequestException(
      "Token is not valid.",
      ErrorCode.INVALID_TOKEN
    );
  }

  const { name, email, password: hashedPassword } = userCache;

  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await deleteUserSignUpCache(email);

  const accessToken = generateAccessToken(
    newUser.email,
    newUser.id,
    newUser.role
  );
  const refreshToken = generateRefreshToken(
    newUser.email,
    newUser.id,
    newUser.role
  );
  await setUserRefreshToken(email, refreshToken);

  res.status(201).json({
    success: true,
    message: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

export const resendVerifyEmail = async (req: Request, res: Response) => {
  const { email } = ResendVerifyEmailSchema.parse(req.body);
  const userCache = await getUserSignUpCache(email);
  if (!userCache) {
    throw new BadRequestException("Invalid request", ErrorCode.EMAIL_NOT_FOUND);
  }

  const verificationToken = generateVerificationToken(email);
  const link = `${env.BACKEND_HOST}/api/auth/verify/${verificationToken}`;
  await setUserSignUpCache(email, userCache);
  await sendVerificationEmail(email, link);

  res.status(201).json({
    success: true,
    message: `verification link has been sent to ${email}`,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = LoginSchema.parse(req.body);

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    throw new NotFoundException(
      "User doesn't exist.",
      ErrorCode.USER_NOT_FOUND
    );
  }

  const passwordMatched = await compareHashedPassword(password, user.password);
  if (!passwordMatched) {
    throw new BadRequestException(
      "Incorrect credentials.",
      ErrorCode.INCORRECT_CREDENTIALS
    );
  }

  const accessToken = generateAccessToken(user.email, user.id, user.role);
  const refreshToken = generateRefreshToken(user.email, user.id, user.role);
  await setUserRefreshToken(email, refreshToken);

  res.status(200).json({
    success: true,
    message: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { email, id, role } = req.user;
  const accessToken = generateAccessToken(email, id, role);
  const refreshToken = generateRefreshToken(email, id, role);
  await setUserRefreshToken(email, refreshToken);

  res.status(200).json({
    success: true,
    message: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const { email } = req.user;
  await deleteUserRefreshToken(email);

  res.status(200).json({
    success: true,
    message: `${email} is logged out.`,
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = ForgotPasswordSchema.parse(req.body);
  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (!user)
    throw new NotFoundException(
      `User with email: ${email} not found.`,
      ErrorCode.USER_NOT_FOUND
    );

  const token = generatePasswordResetToken(email, user.password);
  const resetLink = `${env.BACKEND_HOST}/api/auth/reset/${user.id}/${token}`;

  await sendVerificationEmail(email, resetLink);

  res.status(200).json({
    success: true,
    message: `Email has been sent to ${email}`,
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password: newPassword } = ResetPasswordSchema.parse(req.body);
  const { userId, token } = req.params;
  const hashedPassword = await generateHashedPassword(newPassword);
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user)
    throw new UnauthorizedException("Invalid user.", ErrorCode.USER_NOT_FOUND);
  const decoded = decodePasswordResetToken(token, user.password);
  if (!decoded)
    throw new BadRequestException("Invalid token", ErrorCode.INVALID_TOKEN);
  const { email, id, role } = await updateUserPassword(userId, hashedPassword);
  const accessToken = await generateAccessToken(email, id, role);
  const refreshToken = await generateRefreshToken(email, id, role);
  await setUserRefreshToken(email, refreshToken);
  res.status(200).json({
    success: true,
    message: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};
