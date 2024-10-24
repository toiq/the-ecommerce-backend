import { z } from "zod";
import { RegisterSchema } from "../schema/userSchema.js";
import cacheClient from "../dbclients/cacheClient.js";
import { env } from "../config/env.js";

export const setUserSignUpCache = async (
  email: string,
  user: z.infer<typeof RegisterSchema>
) => {
  // Exp same as verification TTL
  await cacheClient.set(email, JSON.stringify(user), {
    EX: +env.VERIFICATION_TTL,
  });
};

export const setUserRefreshToken = async (
  email: string,
  refreshToken: string
) => {
  // Exp same as refresh token TTL
  await cacheClient.set(email, refreshToken, { EX: +env.REFRESH_TOKEN_TTL });
};

export const getUserSignUpCache = async (email: string) => {
  const cacheData = await cacheClient.get(email);
  if (!cacheData) {
    return null;
  }
  return JSON.parse(cacheData);
};

export const deleteUserSignUpCache = async (email: string) => {
  await cacheClient.del(email);
};

export const deleteUserRefreshToken = async (email: string) => {
  await cacheClient.del(email);
};
