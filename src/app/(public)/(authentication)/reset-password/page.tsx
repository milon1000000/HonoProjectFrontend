import React, { Suspense } from "react";
import ResetPassword from "@/components/form/reset-password";
import { Spinner } from "@/components/ui/spinner"; // আপনার প্রজেক্টের স্পিনার বা সাধারণ লোডার

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          }
        >
          <ResetPassword />
        </Suspense>
      </div>
    </main>
  );
}