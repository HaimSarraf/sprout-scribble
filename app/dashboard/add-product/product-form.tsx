"use client";

import { ProductSchema, productSchema } from "@/types/product-schema";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

export default function ProductForm() {
  const form = useForm<productSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const { success, error } = await getProduct(id);
      if (error) {
        toast.error(error);
        router.push("/dashboard/products");
        return;
      }
      if (success) {
        const id = parseInt(editMode);
        form.setValue("title", success.title);
        form.setValue("description", success.description);
        form.setValue("price", success.price);
        form.setValue("id", id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        router.push("/dashboard/products");
        toast.success(data.data.success);
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
    onExecute: (data) => {
      if (editMode) {
        toast.loading(
          `Product ${data.input.title.toUpperCase()} is Editing ... `,
          { duration: 1 }
        );
      }
      if (!editMode) {
        toast.loading(
          `Product ${data.input.title.toUpperCase()} is Creating ... `,
          { duration: 1 }
        );
      }
    },
    onError: (error) => console.log(error),
  });

  async function onSubmit(values: productSchema) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editMode ? (
            <span>Edit Product</span>
          ) : (
            <span>Create A New Product</span>
          )}
        </CardTitle>
        <CardDescription>
          {editMode
            ? "Make Changes to an Existing Product"
            : "Add a Brand New Product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={34}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Price/(USD)"
                        step="0.1"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                className={
                  status === "executing"
                    ? "w-1/2 justify-center"
                    : "w-1/2 justify-center"
                }
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
