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
import { loginSchema, LoginSchema } from "@/types/login-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const LoginForm = () => {
  const form = useForm<loginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
      if (data.data?.twoFactor) {
        setShowTwoFactor(true);
      }
    },
  });

  const onSubmit = (values: loginSchema) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Welcome Back !"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full items-center justify-center flex flex-col pb-10"
          >
            <div className="flex flex-col w-1/2">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="text-center flex flex-col gap-6 items-center">
                      <FormLabel className="font-mono text-chart-4/90 font-semibold text-sm">
                        {" "}
                        We&apos;ve Sent a Two Factor Code to Your Email
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={status === "executing"}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={1} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={2} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={3} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={4} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
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
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </>
              )}

              <FormSuccess message={success} />
              <FormError message={error} />
              {!showTwoFactor && (
                <Button size={"sm"} variant={"link"} asChild className="px-0">
                  <Link href="/auth/reset">Forgot Password ?</Link>
                </Button>
              )}
            </div>
            <Button
              type="submit"
              className={cn(
                "w-1/2 my-4",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              {showTwoFactor ? "Verify" : "Sign In"}
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
