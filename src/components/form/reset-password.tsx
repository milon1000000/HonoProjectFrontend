"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";

import { useResetPassword } from "@/hooks";
import { resetPasswordValidationSchema } from "@/validation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      newPassword: "",
    },
    validators: {
      onSubmit: resetPasswordValidationSchema,
    },
    onSubmit: ({ value }) => {
      resetPassword(value, {
        onSuccess: (res: any) => {
          toast.add({
            title: "Password Reset Successful",
            description:
              res?.message || "Your password has been reset. Please log in.",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err: any) => {
          toast.add({
            title: "Reset Failed",
            description:
              err?.data?.message ||
              err?.message ||
              "Failed to reset password. Please verify the OTP and try again.",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to your email and your new password
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

          {/* OTP Field */}
          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>OTP Code</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    maxLength={6}
                    placeholder="6-digit OTP (e.g. 123456)"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* New Password Field */}
          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
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
                      autoComplete="new-password"
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
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Resetting password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </FieldGroup>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}