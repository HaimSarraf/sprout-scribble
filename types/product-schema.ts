import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(4, {
    message: "Must Be More Than 4 Characters",
  }),
  description: z.string().min(20, {
    message: "Must Be More Than 20 Characters",
  }),
  price: z.coerce
    .number({
      invalid_type_error: "Price Must Be A Number",
    })
    .positive({
      message: "Price Must Be A Positive-Number !",
    }),
});

export type productSchema = z.infer<typeof ProductSchema>;
