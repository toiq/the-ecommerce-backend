import { z } from "zod";

export const ChangePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8),
});
