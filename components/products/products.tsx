"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/formatPrice";

type Props = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: Props) {
  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {variants.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            className="rounded-md pb-2"
            src={variant.variantImages[0].url}
            width={720}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />

          <div className="flex justify-between">
            <div className="font-medium flex flex-col gap-4">
              <h2>{variant.product.title}</h2>
              <p
                className="text-sm text-muted rounded-xl p-2 font-medium font-mono"
                style={{ background: variant.color }}
              >
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge
                className="text-sm hover:bg-slate-500 hover:text-white hover:scale-110"
                variant={"secondary"}
              >
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
