"use server"

import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settings = action.schema(SettingsSchema).action(
  async (args: {
    parsedInput: {
      name?: string;
      image?: string;
      password?: string;
      newPassword?: string;
      isTwoFactorEnabled?: boolean;
      email?: string;
    };
  }) => {
    const user = await auth();
    if (!user) {
      return { error: "User not Found" };
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUser) {
      return { error: "User not Found" };
    }

    if (user.user.isOAuth) {
      args.parsedInput.email = undefined;
      args.parsedInput.password = undefined;
      args.parsedInput.newPassword = undefined;
      args.parsedInput.isTwoFactorEnabled = undefined;
    }

    if (
      args.parsedInput.password &&
      args.parsedInput.newPassword &&
      dbUser.password
    ) {
      const passwordMatch = await bcrypt.compare(
        args.parsedInput.password,
        dbUser.password
      );

      if (!passwordMatch) {
        return { error: "Password Does Not Match" };
      }

      const samePassword = await bcrypt.compare(
        args.parsedInput.newPassword,
        dbUser.password
      );

      if (samePassword) {
        return { error: "New Password Is The Same As The Old One" };
      }

      const hashedPassword = await bcrypt.hash(
        args.parsedInput.newPassword,
        10
      );

      args.parsedInput.password = hashedPassword;

      args.parsedInput.newPassword = undefined;
    }
    const updatedUser = await db
      .update(users)
      .set({
        name: args.parsedInput.name,
        password: args.parsedInput.password,
        twoFactorEnabled: args.parsedInput.isTwoFactorEnabled,
        email: args.parsedInput.email,
        image: args.parsedInput.image,
      })
      .where(eq(users.id, dbUser.id));

    revalidatePath("/dashboard/settings");

    return { success: "Settings Updated" };
  }
);
