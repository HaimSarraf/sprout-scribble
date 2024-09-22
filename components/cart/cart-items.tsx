"use client";

import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/lib/client-store";
import formatPrice from "@/lib/formatPrice";
import { MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import empty from "@/public/empty.json";
import { createId } from "@paralleldrive/cuid2";

export default function CartItems() {
  const { cart, addToCart, removerFromCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  return (
    <motion.div>
      {cart.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your Cart is Empty
            </h2>
            <Lottie className="h-72" animationData={empty} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <Table>
          <TableHeader className="font-bold font-mono">
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="text-muted-foreground text-xs font-mono">
                  {i.name}
                </TableCell>
                <TableCell>{formatPrice(i.price)}</TableCell>
                <TableCell>
                  <div>
                    <Image
                      className="rounded-md"
                      width={48}
                      height={48}
                      src={i.image}
                      alt={i.name}
                      priority
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <MinusCircle
                      size={20}
                      onClick={() => {
                        removerFromCart({
                          ...i,
                          variant: {
                            quantity: 1,
                            variantID: i.variant.variantID,
                          },
                        });
                      }}
                    />
                    <p className="text-lg font-bold font-mono">
                      {i.variant.quantity}
                    </p>
                    <PlusCircle
                      size={20}
                      className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                      onClick={() => {
                        addToCart({
                          ...i,
                          variant: {
                            quantity: 1,
                            variantID: i.variant.variantID,
                          },
                        });
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <motion.div className="flex items-center justify-center relative my-4 overflow-hidden">
        <span className="text-base">Total : $ </span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, index) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="text-base inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
