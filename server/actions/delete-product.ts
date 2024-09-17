"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();
const deleteSchema = z.object({ id: z.number() });

export const deleteProduct = action
  .schema(deleteSchema)
  .action(
    async ({ parsedInput }: { parsedInput: z.infer<typeof deleteSchema> }) => {
      try {
        const { id } = parsedInput;

        const data = await db
          .delete(products)
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");
        return {
          success: `Product ${data[0].title.toUpperCase()} Has Been Deleted Permanently`,
        };
      } catch (error) {
        return { error: "Failed To Delete Product !" };
      }
    }
  );
