"use server";

import { createOrderSchema, CreateOrderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "@/server";
import { orderProduct, orders } from "../schema";

const action = createSafeActionClient();

export const createOrder = action
  .schema(CreateOrderSchema)
  .action(async ({ parsedInput }: { parsedInput: createOrderSchema }) => {
    const { paymentIntentID, products, status, total } = parsedInput;

    const user = await auth();

    if (!user) return { error: "user not Found" };

    const order = await db
      .insert(orders)
      .values({
        status,
        paymentIntentID,
        total,
        userID: user.user.id,
      })
      .returning();

    const orderProducts = products.map(
      async ({ productID, quantity, variantID }) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantID: variantID,
        });
      }
    );
    return { success: "Order Has Been Added" };
  });
