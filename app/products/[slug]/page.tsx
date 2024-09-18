import ProductPick from "@/components/products/product-pick";
import ProductType from "@/components/products/ProductType";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/formatPrice";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantTags: true,
      variantImages: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));

    return slugID;
  }
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });
  if (variant) {
    return (
      <div>
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div className="flex-1">
            <div>
              <Image
                src={variant.product.productVariants[0].variantImages[0].url}
                alt={variant.product.productVariants[0].variantImages[0].name}
                width={250}
                height={250}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col flex-1">
            <h2>{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
            </div>
            <Separator />
            <p className="text-2xl font-medium">
              {formatPrice(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground">Available Colors</p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((pv) => (
                <ProductPick
                  key={pv.id}
                  id={pv.id}
                  color={pv.color}
                  image={pv.variantImages[0].url}
                  price={+formatPrice(variant.product.price)}
                  productID={variant.productID}
                  productType={pv.productType}
                  title={variant.product.title}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
