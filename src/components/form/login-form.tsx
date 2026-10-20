"use client";

import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";
import { Button } from "../ui/button";

import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.add({
        title: "Login Error",
        description: decodeURIComponent(error),
        type: "error",
      });
      router.replace("/login");
    }
  }, [searchParams, router]);

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: (res: any) => {
          const accessToken = res?.data?.accessToken;
          if (accessToken && typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);
          }
          toast.add({
            title: "Login Success",
            description: "Welcome back!",
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["user"] });
          router.push("/");
          router.refresh();
        },
        onError: (err: any) => {
          toast.add({
            title: "Authorization failure",
            description:
              err?.data?.message ||
              err?.message ||
              "Something went wrong. Please try again.",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Login to your account
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {/* Email Field */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="name@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="email"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Password Field */}
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="current-password"
                      aria-invalid={isInvalid}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Submit Button */}
          <Button disabled={loginPending} type="submit" className="w-full">
            {loginPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Submitting...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldSeparator>Or continue with</FieldSeparator>

      <GoogleLoginButton text="Continue with Google" />

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Register
        </Link>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Want to become a landlord?{" "}
        <Link
          href="/landloard-apply"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Apply as Landlord
        </Link>
      </div>
    </div>
  );
}

