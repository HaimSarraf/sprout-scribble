import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

export const action = createSafeActionClient();

export const emailSignIn = action.schema(LoginSchema).action(
  async ({
    parsedInput,
  }: {
    parsedInput: {
      email: string;
      password: string;
      code?: string | undefined;
    };
  }) => {
    const { email, password, code } = parsedInput;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "Email Not Found" };
    }

    // if (!existingUser.emailVerified) {
    //   return { error: "" };
    // }

    return { success: email };
  }
);
