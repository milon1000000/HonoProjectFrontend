"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { useLandloardVerify, useVerification } from "@/hooks";
import { toast } from "../ui/toast";

const RESEND_COOLDOWN = 120;

interface VerifyAccountFormProps {
  mode?: "landlord" | "user";
}

export default function VerifyAccountForm({
  mode: propMode,
}: VerifyAccountFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  // মোড অনুযায়ী আলাদা হুক ও পেন্ডিং স্টেট
  const { mutate: verifyUser, isPending: isUserPending } = useVerification();
  const { mutate: verifyLandlord, isPending: isLandlordPending } = useLandloardVerify();

  // Mode resolution:
  // 1. propMode (if passed directly)
  // 2. searchParams (?mode=landlord or ?type=landlord)
  // 3. Defaults to "user" (for registration verification)
  const paramMode = (searchParams.get("mode") || searchParams.get("type")) as "landlord" | "user" | null;
  const isExplicitMode = Boolean(propMode || paramMode);
  const mode: "landlord" | "user" = propMode || (paramMode === "landlord" ? "landlord" : "user");

  const isPending = isUserPending || isLandlordPending;
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.replace("/");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOTP = (codeToVerify = otp) => {
    if (codeToVerify.length !== 6) {
      setIsInvalid(true);
      setErrorMessage("Please enter a 6-digit OTP code.");
      return;
    }

    const verifyData = {
      email,
      otp: codeToVerify,
    };

    const handleUserSuccess = (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.add({
        title: "Verification Successful",
        description: res?.message || "Welcome onboard! Your account has been verified.",
        type: "success",
      });
      router.push("/");
      router.refresh();
    };

    const handleLandlordSuccess = (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.add({
        title: "Verification Successful",
        description:
          res?.message ||
          "Your application is verified. An admin will review and approve your account shortly.",
        type: "success",
      });
      router.push("/");
      router.refresh();
    };

    const handleError = (err: any) => {
      setIsInvalid(true);
      const errorText =
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid OTP or verification failed.";
      setErrorMessage(errorText);
      toast.add({
        title: "Verification Failure",
        description: errorText,
        type: "error",
      });
    };

    if (mode === "landlord") {
      verifyLandlord(verifyData, {
        onSuccess: (res: any) => {
          if (res?.success === false) {
            handleError(res);
            return;
          }
          handleLandlordSuccess(res);
        },
        onError: (err: any) => {
          const msg = err?.data?.message || err?.message || "";
          // If mode was not explicitly specified and landlord check failed with not found, fallback to user verification
          if (!isExplicitMode && (msg.includes("Not Found") || msg.includes("Expired"))) {
            verifyUser(verifyData, {
              onSuccess: (res: any) => {
                if (res?.success === false) {
                  handleError(res);
                  return;
                }
                handleUserSuccess(res);
              },
              onError: handleError,
            });
            return;
          }
          handleError(err);
        },
      });
    } else {
      // mode === "user"
      verifyUser(verifyData, {
        onSuccess: (res: any) => {
          if (res?.success === false) {
            handleError(res);
            return;
          }
          handleUserSuccess(res);
        },
        onError: (err: any) => {
          const msg = err?.data?.message || err?.message || "";
          // If mode was not explicitly specified and user check failed with Tenant Doesnt Exist, fallback to landlord verification
          if (!isExplicitMode && (msg.includes("Tenant Doesnt Exist") || msg.includes("Invalid OTP"))) {
            verifyLandlord(verifyData, {
              onSuccess: (res: any) => {
                if (res?.success === false) {
                  handleError(res);
                  return;
                }
                handleLandlordSuccess(res);
              },
              onError: () => handleError(err),
            });
            return;
          }
          handleError(err);
        },
      });
    }
  };

  const handleResend = () => {
    setResendTimer(RESEND_COOLDOWN);
    setOtp("");
    setIsInvalid(false);
    toast.add({
      title: "OTP Resent",
      description: `A new code has been sent to ${email}`,
      type: "info",
    });
  };

  if (!email) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "landlord" ? "Verify Landlord Account" : "Verify Account"}
        </CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to{" "}
          <span className="font-semibold text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOTP();
          }}
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">Enter Verification Code</FieldLabel>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (isInvalid) setIsInvalid(false);
                if (value.length === 6) {
                  handleOTP(value);
                }
              }}
              autoComplete="one-time-code"
              name="otp"
              id="otp"
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {isInvalid && <FieldError errors={[{ message: errorMessage }]} />}

            <FieldDescription className="mt-2">
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Didn't receive the code? Click resend below."}
            </FieldDescription>
          </Field>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={resendTimer > 0 || isPending}
          onClick={handleResend}
        >
          Resend Code
        </Button>
        <Button
          type="submit"
          form="otp-form"
          disabled={isPending || otp.length !== 6}
        >
          {isPending ? "Verifying..." : "Verify & Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}