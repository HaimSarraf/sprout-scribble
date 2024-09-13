import { z } from "zod";

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email Is Required",
  }),
});

export type resetSchema = z.infer<typeof ResetSchema>;
