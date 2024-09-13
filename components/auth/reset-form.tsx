"use client";

import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema, resetSchema } from "@/types/reset-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { reset } from "@/server/actions/password-reset";

export const ResetForm = () => {
  const form = useForm<resetSchema>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: resetSchema) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot Your Password ?"
      backButtonHref="/auth/login"
      backButtonLabel="Back To Login"
      showSocials
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full items-center justify-center flex flex-col pb-10"
          >
            <div className="flex flex-col w-1/2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="user@test.com"
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              {/* <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot Password</Link>
              </Button> */}
            </div>
            <Button
              type="submit"
              className={cn(
                "w-1/2 my-2",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Reset Password
            </Button>
            <div className="text-chart-4 font-bold font-mono pt-20 flex flex-col items-center gap-4">
              Want to try Logging In With your google / github ?{" "}
              <span className="text-4xl">⬇</span>
            </div>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
