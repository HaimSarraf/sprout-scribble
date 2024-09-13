import { z } from "zod";

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  token: z.string().nullable().optional(),
});

export type newPasswordSchema = z.infer<typeof NewPasswordSchema>;
