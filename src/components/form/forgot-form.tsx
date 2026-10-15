"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import { useForgotPassword } from "@/hooks";
import { tanantForgorPasswordSchema } from "@/validation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: tanantForgorPasswordSchema,
    },
    onSubmit: ({ value }) => {
      forgotPassword(value, {
        onSuccess: (res: any) => {
          toast.add({
            title: "Reset Link Sent",
            description:
              res?.message ||
              "Please check your email for the password reset instructions.",
            type: "success",
          });
          router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
        },
        onError: (err: any) => {
          toast.add({
            title: "Request Failed",
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
          Forgot your password?
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address and we will send you a reset link
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

          {/* Submit Button */}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Sending OTP...
              </span>
            ) : (
              "Send Reset OTP"
            )}
          </Button>
        </FieldGroup>
      </form>

      {/* Back to Login Footer */}
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
