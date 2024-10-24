import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { z } from "zod";
import { RegisterSchema } from "../schema/authSchema.js";
import { Role } from "@prisma/client";

export const generateAccessToken = (
  email: string,
  id: string,
  role: Role,
  sessionId: string
) => {
  const payload = { email: email, id: id, role: role, sessionId: sessionId };
  const secret = env.ACCESS_TOKEN_SECRET;
  const options = { expiresIn: env.ACCESS_TOKEN_TTL };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export const generateRefreshToken = (
  email: string,
  id: string,
  role: Role,
  sessionId: string
) => {
  const payload = { email: email, id: id, role: role, sessionId: sessionId };
  const secret = env.REFRESH_TOKEN_SECRET;
  const options = { expiresIn: env.REFRESH_TOKEN_TTL };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export const generateVerificationToken = (email: string) => {
  const payload = { email: email };
  const secret = env.VERIFICATION_SECRET;
  const options = { expiresIn: env.VERIFICATION_TTL };
  const token = jwt.sign(payload, secret, options);

  return token;
};

export const generatePasswordResetToken = (
  email: string,
  oldPassword: string
) => {
  const payload = { email: email };
  // Same secret and ttl as verification
  const secret = env.VERIFICATION_SECRET + oldPassword;
  const options = { expiresIn: env.VERIFICATION_TTL };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export const decodeVerificationToken = (verificationToken: string) => {
  return jwt.verify(verificationToken, env.VERIFICATION_SECRET) as z.infer<
    typeof RegisterSchema
  > & { sessionId: string };
};
