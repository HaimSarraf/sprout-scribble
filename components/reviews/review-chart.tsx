"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import { Card, CardDescription, CardTitle } from "../ui/card";
// import Stars from "./stars";
import { getReviewAverage } from "@/lib/review-average";
import { useMemo } from "react";
import { Progress } from "../ui/progress";

export default function ReviewChart({
  reviews,
}: {
  reviews: ReviewsWithUser[];
}) {
  const totalRating = getReviewAverage(reviews.map((r) => r.rating));

  const getRatingByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;
    reviews.forEach((review) => {
      const starIndex = review.rating - 1;
      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    });
    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);

  return (
    <Card className="flex flex-col p-8 rounded-md gap-4">
      <div className="flex gap-2 flex-col">
        <CardTitle>Produc Rating : </CardTitle>
        {/* <Stars size={18} totalReviews={reviews.length} rating={totalRating} /> */}
        <CardDescription className="text-lg font-medium ">
          {totalRating.toFixed(1)} stars{" "}
        </CardDescription>
      </div>
      {getRatingByStars.map((rating, index) => (
        <div key={index} className="flex justify-between items-center gap-2">
          <p className="text-xs font-light flex gap-1">
            {index + 1} <span>stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
}
