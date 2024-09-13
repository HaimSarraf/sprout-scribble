"use server";

import { createSafeActionClient } from "next-safe-action";
import { resetSchema, ResetSchema } from "@/types/reset-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

const action = createSafeActionClient();

export const reset = action
  .schema(ResetSchema)
  .action(async ({ parsedInput }: { parsedInput: resetSchema }) => {
    const { email } = parsedInput;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "No User Found" };
    }
    const passwordResetToken = await generatePasswordResetToken(email);

    if (!passwordResetToken) {
      return { error: "Token Not Generated" };
    }

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );

    return { success: "Reset-Password Email Sent !" };
  });
