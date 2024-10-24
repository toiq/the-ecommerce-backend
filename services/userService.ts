import { z } from "zod";
import { RegisterSchema } from "../schema/userSchema.js";
import cacheClient from "../dbclients/cacheClient.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import prismaClient from "../dbclients/prismaClient.js";

export const setUserSignUpCache = async (
  email: string,
  user: z.infer<typeof RegisterSchema>
) => {
  // Exp same as verification TTL
  await cacheClient.set(email, JSON.stringify({ ...user }), {
    EX: +env.VERIFICATION_TTL,
  });
};

export const setUserRefreshToken = async (
  refreshToken: string,
  sessionId: string
) => {
  // Exp same as refresh token TTL
  await cacheClient.set(sessionId, refreshToken, {
    EX: +env.REFRESH_TOKEN_TTL,
  });
};

export const getUserSignUpCache = async (email: string) => {
  const cacheData = await cacheClient.get(email);
  if (!cacheData) {
    return null;
  }
  return JSON.parse(cacheData);
};

export const getUserRefreshToken = async (sessionId: string) => {
  return await cacheClient.get(sessionId);
};

export const decodePasswordResetToken = (
  passwordResetToken: string,
  currentPassword: string
) => {
  const secret = env.VERIFICATION_SECRET + currentPassword;
  return jwt.verify(passwordResetToken, secret);
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string
) => {
  return await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
};

export const deleteUserSignUpCache = async (email: string) => {
  await cacheClient.del(email);
};

export const deleteUserRefreshToken = async (sessionId: string) => {
  await cacheClient.del(sessionId);
};
