"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import OrederConfirmed from "./order-confirmed";

export default function CartDrawer() {
  const { cart, checkoutProgress, cartOpen, setCartOpen } = useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5
                    w-5 h-5 dark:bg-primary dark:text-black bg-primary text-black text-xs font-bold rounded-full
                "
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-50vh w-5/6 justify-self-center">
        <DrawerHeader>
          <div className="flex items-center justify-center">
            <CartMessage />
          </div>
        </DrawerHeader>
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" ? <CartItems /> : null}
          {checkoutProgress === "confirmation-page" ? (
            <OrederConfirmed />
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
