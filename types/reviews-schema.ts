import * as z from "zod";

export const ReviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "Please Add at least One Star" })
    .max(5, { message: "Please Add no more than 5 Stars" }),
  comment: z
    .string()
    .min(10, { message: "Please Add at least 10 characters for this Review" }),
});

export type reviewSchema = z.infer<typeof ReviewSchema>;
