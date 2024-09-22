import AddCart from "@/components/cart/add-cart";
import ProductPick from "@/components/products/product-pick";
import ProductsShowcase from "@/components/products/products-showcase";
import ProductType from "@/components/products/ProductType";
import Reviews from "@/components/reviews/reviews";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/formatPrice";
import { getReviewAverage } from "@/lib/review-average";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

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
          reviews: true,
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

  const reviewAvg = getReviewAverage(
    variant?.product.reviews?.map((r) => r.rating) || []
  );

  if (variant) {
    return (
      <div>
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-20">
          <div className="flex-1">
            <div>
              <ProductsShowcase variants={variant.product.productVariants} />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-2xl font-bold font-mono">
              {variant?.product.title}
            </h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
              <Stars
                rating={reviewAvg}
                totalReviews={variant.product.reviews.length}
              />
            </div>
            <Separator className="my-4" />
            <p className="text-2xl font-medium py-2">
              {formatPrice(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground font-medium my-2">
              Available Colors
            </p>
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
            <AddCart />
          </div>
        </section>
        <Reviews productID={variant.productID} />
      </div>
    );
  }
}
