"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/client-store";
import Lottie from "lottie-react";
import waitingCard from "@/public/waiting-card.json";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function OrederConfirmed() {
  const { setCheckoutProgress, setCartOpen, clearCart } = useCartStore();

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <Button
        variant={"destructive"}
        className="flex flex-row gap-4 items-center justify-center px-24 text-balance cursor-pointer"
        onClick={() => setCheckoutProgress("cart-page")}
      >
        <ArrowLeft size={14} />
        Back to Cart
      </Button>
      <motion.div
        className="bg-red-50 rounded-full"
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0.2, scale: 0.2 }}
        transition={{ delay: 0.5, ease: "circInOut" }}
      >
        <Lottie className="h-40" animationData={waitingCard} />
      </motion.div>
      <h2 className="text-muted-foreground">Finalize Your Shopping By Clicking The Button Below</h2>
      <Link href={"/dashboard/products"}>
        <Button
          onClick={() => {
            setCheckoutProgress("cart-page");
            clearCart();
            setCartOpen(false);
            toast.success("Your Payment Was Successful");
          }}
          className="px-28 font-bold text-lg"
        >
          Confirm & Pay
        </Button>
      </Link>
    </div>
  );
}
