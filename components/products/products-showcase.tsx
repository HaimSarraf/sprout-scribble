"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsShowcase({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectColor = searchParams.get("type") || variants[0].productType;

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.productType === selectColor &&
            variant.variantImages.map((image) => {
              return (
                <CarouselItem key={image.url}>
                  {image.url ? (
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        priority
                        className="rounded-md"
                        width={128}
                        height={72}
                        src={image.url}
                        alt={image.name}
                      />
                    </div>
                  ) : null}
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <CarouselNext className="mr-4 hover:scale-105 hover:bg-black hover:text-white" />
      <CarouselPrevious className="ml-4 hover:scale-105 hover:bg-black hover:text-white" />
      <div className="flex overflow-clip py-20 gap-4 justify-center">
        {variants.map(
          (variant) =>
            variant.productType === selectColor &&
            variant.variantImages.map((image, index) => {
              return (
                <div key={image.url}>
                  {image.url ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-50",
                        "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                      )}
                      width={72}
                      height={48}
                      src={image.url}
                      alt={image.name}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
}
