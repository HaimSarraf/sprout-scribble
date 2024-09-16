"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "../schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const action = createSafeActionClient();

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
    try {
      const { email, password, code } = parsedInput;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "Email Not Found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );

        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Confirmation Email Sent !" };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorToken) {
            return { error: "Two Factor Token Not Found" };
          }
          if (twoFactorToken.token !== code) {
            return { error: "Invalid Two Factor Code" };
          }
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "Two Factor Token Expired" };
          }
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);
          if (!token) {
            return { error: "Token Not Generated ! " };
          }
          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: "TwoFactor Token Sent ! " };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "User Signed" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  }
);
