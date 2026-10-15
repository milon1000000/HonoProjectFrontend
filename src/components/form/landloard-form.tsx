"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";

import { useLandloardApply } from "@/hooks";
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
import { landlordRegistrationValidationSchema } from "@/validation/landloard.validation";

export default function LandlordForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: applyLandlord, isPending } = useLandloardApply();

  const form = useForm({
    defaultValues: {
      user: {
        name: "",
        email: "",
        contactNumber: "",
      },
      landlord: {
        address: "",
        nidOrPassportNumber: "",
      },
    },
    validators: {
      onSubmit: landlordRegistrationValidationSchema,
    },
    onSubmit: ({ value }) => {
      applyLandlord(value, {
        onSuccess: (res: any) => {
          toast.add({
            title: "Application Submitted",
            description:
              res?.message ||
              "Your landlord application has been submitted successfully.",
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["user"] });

          // ইমেইলটি সার্চ প্যারাম হিসেবে পাঠানো হচ্ছে
          const params = new URLSearchParams();
          params.set("email", value.user.email);
          router.push(`/register/verify-account?${params.toString()}`);
        },
        onError: (err: any) => {
          toast.add({
            title: "Application Failed",
            description:
              err?.data?.message ||
              err?.message ||
              "Could not submit application. Please check your information.",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Apply as Landlord</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Provide your personal and property details to apply
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <FieldGroup>
          <div className="text-sm font-semibold text-foreground">
            Personal Information
          </div>

          {/* Full Name */}
          <form.Field name="user.name">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Md. Rahim Uddin"
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

          {/* Email */}
          <form.Field name="user.email">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
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

          {/* Contact Number */}
          <form.Field name="user.contactNumber">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    placeholder="+8801712345678"
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

          <FieldSeparator />

          <div className="text-sm font-semibold text-foreground">
            Verification & Address
          </div>

          {/* Address */}
          <form.Field name="landlord.address">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="House 12, Road 5, Dhanmondi, Dhaka"
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

          {/* NID / Passport Number */}
          <form.Field name="landlord.nidOrPassportNumber">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.isSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    NID or Passport Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="1998765432109"
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

          <Button disabled={isPending} type="submit" className="w-full mt-2">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Submitting application...
              </span>
            ) : (
              "Submit Application"
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}