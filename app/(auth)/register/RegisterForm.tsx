"use client";

import ErrorMessage from "@/components/error-message";
import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SignUpSchema, signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleCredentialsSignin, handleSignUp } from "../actions";
import LogoAuth from "../logo";
import SocialLogin from "../SocialLogin";

const RegisterForm = () => {
  const [globalError, setGlobalError] = useState("");

  const form = useForm<z.infer<SignUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<SignUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleSignUp(values);
      if (result.success) {
        console.log("Account created successfully.");
        const valuesForSignin = {
          email: values.email,
          password: values.password,
        };
        await handleCredentialsSignin(valuesForSignin);
      } else {
        setGlobalError(result.message);
      }
    } catch (error) {
      console.log(error);
      setGlobalError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <LogoAuth />
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>
              Use one of the buttons below to create an account.
            </CardDescription>
            {globalError && <ErrorMessage error={globalError} />}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <SocialLogin />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    {/* Form here */}
                    {["name", "email", "password", "confirmPassword"].map(
                      (field) => (
                        <FormField
                          control={form.control}
                          key={field}
                          name={field as keyof z.infer<typeof signUpSchema>}
                          render={({ field: fieldProps }) => (
                            <FormItem>
                              <FormLabel>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type={
                                    field.includes("password") ||
                                    field.includes("confirmPassword")
                                      ? "password"
                                      : field === "email"
                                        ? "email"
                                        : "text"
                                  }
                                  placeholder={`Enter your ${field}`}
                                  {...fieldProps}
                                  autoComplete="off"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ),
                    )}
                    <LoadingButton pending={form.formState.isSubmitting}>
                      Register
                    </LoadingButton>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account? {""}
                    <Link
                      href="/login"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
