import { hash, compare } from "bcrypt";
import { env } from "../config/env.js";

export const generateHashedPassword = async (plainPassword: string) => {
  const salt = +env.SALT_ROUND;
  const hashedPassword = await hash(plainPassword, salt);
  return hashedPassword;
};

export const compareHashedPassword = async (
  passwordInput: string,
  hashedPassword: string
) => {
  return await compare(passwordInput, hashedPassword);
};
