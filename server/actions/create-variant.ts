"use server";

import { VariantSchema, variantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import {
  productVariants,
  products,
  variantImages,
  variantTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const createVariant = action
  .schema(VariantSchema)
  .action(async ({ parsedInput }: { parsedInput: variantSchema }) => {
    const {} = parsedInput;
    try {
      if (parsedInput.editMode && parsedInput.id) {
        const editVariant = await db
          .update(productVariants)
          .set({
            color: parsedInput.color,
            productType: parsedInput.productType,
            updated: new Date(),
          })
          .where(eq(productVariants.id, parsedInput.id))
          .returning();
        await db
          .delete(variantTags)
          .where(eq(variantTags.variantID, editVariant[0].id));
        await db.insert(variantTags).values(
          parsedInput.tags.map((tag) => ({
            tag,
            variantID: editVariant[0].id,
          }))
        );
        await db
          .delete(variantImages)
          .where(eq(variantImages.variantID, editVariant[0].id));
        await db.insert(variantImages).values(
          parsedInput.variantImages.map((img, idx) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: editVariant[0].id,
            order: idx,
          }))
        );
        client.partialUpdateObject({
          indexName: "products",
          objectID: editVariant[0].id.toString(),
          attributesToUpdate: {
            id: editVariant[0].productID,
            productType: editVariant[0].productType,
            variantImages: parsedInput.variantImages[0].url,
          },
        });
        revalidatePath("/dashboard/products");
        return { success: `Edited ${parsedInput.productType}` };
      }
      if (!parsedInput.editMode) {
        const newVariant = await db
          .insert(productVariants)
          .values({
            productType: parsedInput.productType,
            color: parsedInput.color,
            productID: parsedInput.productID,
          })
          .returning();
        const product = await db.query.products.findFirst({
          where: eq(products.id, parsedInput.productID),
        });
        await db.insert(variantTags).values(
          parsedInput.tags.map((tag) => ({
            tag,
            variantID: newVariant[0].id,
          }))
        );
        await db.insert(variantImages).values(
          parsedInput.variantImages.map((img, idx) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: newVariant[0].id,
            order: idx,
          }))
        );
        if (product) {
          client.saveObject({
            indexName: "products",
            body: {
              objectID: newVariant[0].id.toString(),
              id: newVariant[0].productID,
              title: product.title,
              price: product.price,
              productType: newVariant[0].productType,
              variantImages: parsedInput.variantImages[0].url,
            },
          });
        }
        revalidatePath("/dashboard/products");
        return { success: `Added ${parsedInput.productType}` };
      }
    } catch (error) {
      return { error: "Failed to Create Variant" };
    }
  });
