"use server";

import {  reviewSchema,ReviewSchema } from "@/types/reviews-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const addReview = action
  .schema(ReviewSchema)
  .action(async ({ parsedInput }: { parsedInput: reviewSchema }) => {
    const { comment, productID, rating } = parsedInput;

    try {
      const session = await auth();

      if (!session) return { error: "Please Sign In" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if (reviewExists) {
        return { success: "You Have Already Reviewed This Product" };
      }

      const newReview = await db
        .insert(reviews)
        .values({
          comment,
          rating,
          productID,
          userID: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productID}`);

      return { success: newReview[0] };
    } catch (err) {
      return {
        error: JSON.stringify(err),
      };
    }
  });
