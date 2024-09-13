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
import {
  NewPasswordSchema,
  newPasswordSchema,
} from "@/types/new-password-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const form = useForm<newPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(newPassword, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: newPasswordSchema) => {
    execute({ password: values.password, token });
  };

  return (
    <AuthCard
      cardTitle="Enter New Password"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        autoComplete="current-password"
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
