"use client";

import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowDown } from "lucide-react";

export default function CartMessage() {
  const { checkoutProgress } = useCartStore();

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
      className="flex flex-col items-center p-2 gap-2"
    >
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "Your Cart Items" : null}
        {checkoutProgress === "confirmation-page" ? "Order Confirmed" : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkoutProgress === "cart-page" ? "View & Edit Your Bag" : null}
        {checkoutProgress === "confirmation-page" ? (
          <p className="flex flex-col items-center justify-center">
            <span className="hover:text-destructive cursor-pointer">
              Want To Check Your Bag Again ? Click The Button Below
            </span>
            <ArrowDown size={14} />
          </p>
        ) : null}
      </DrawerDescription>
    </motion.div>
  );
}
