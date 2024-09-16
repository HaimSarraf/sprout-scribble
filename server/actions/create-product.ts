"use server";

import { createSafeActionClient } from "next-safe-action";
import { ProductSchema, productSchema } from "@/types/product-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createProduct = action
  .schema(ProductSchema)
  .action(async ({ parsedInput }: { parsedInput: productSchema }) => {
    const { description, price, title, id } = parsedInput;

    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: "Product not Found" };
        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");
        return { success: `Product ${editedProduct[0].title} has been Edited` };
      }

      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();

        revalidatePath("/dashboard/products");
        return {
          success: `Product ${newProduct[0].title.toUpperCase()} has been Created`,
        };
      }
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
