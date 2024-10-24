import { randomBytes } from "crypto";

export const generateSessionId = (length: number = 32): string => {
  return randomBytes(length).toString("hex");
};
