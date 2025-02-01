"use client";

import ErrorMessage from "@/components/error-message";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SocialLogin from "../SocialLogin";
import { handleCredentialsSignin, handleSignUp } from "../actions";

export default function SignUp() {
  const [globalError, setGlobalError] = useState("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
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
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-6">
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Create Account
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Use one of the buttons below to create an account.
          </p>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <SocialLogin />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
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
              ))}
              <LoadingButton pending={form.formState.isSubmitting}>
                Sign up
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
