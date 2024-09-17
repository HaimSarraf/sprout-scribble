"use server";
import { createSafeActionClient } from "next-safe-action";
import * as z from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch, SearchClient } from "algoliasearch";

const action = createSafeActionClient();

const client: SearchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const deleteVariant = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }: { parsedInput: { id: number } }) => {
    const { id } = parsedInput;
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("dashboard/products");
      client.deleteObject({
        indexName: "products",
        objectID: deletedVariant[0].id.toString(),
      });
      return { success: `Deleted ${deletedVariant[0].productType}` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
