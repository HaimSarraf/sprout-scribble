import { z } from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New Password Is Required",
      path: ["newPassword"],
    }
  );

export type settingsSchema = z.infer<typeof SettingsSchema>;
