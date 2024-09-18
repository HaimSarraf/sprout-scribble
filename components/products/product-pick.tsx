"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductPick({
  id,
  color,
  title,
  price,
  productType,
  productID,
  image,
}: {
  id: number;
  color: string;
  title: string;
  price: number;
  productType: string;
  productID: number;
  image: string;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const selctedColor = searchParams.get("type") || productType;

  return (
    <div
      style={{ background: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-70",
        selctedColor === productType ? "opacity-100" : "opacity-50"
      )}
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&price=${price}&productID=${productID}&title=${title}&type=${productType}&image=${image}&color=${color}`,
          { scroll: false }
        )
      }
    ></div>
  );
}
