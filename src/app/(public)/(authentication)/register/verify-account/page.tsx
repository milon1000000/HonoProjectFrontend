import VerifyAccountForm from "@/components/form/verify-account-form";
import React, { Suspense } from "react";

export default function VerifyPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-4 md:p-8 bg-muted/40">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyAccountForm />
        </Suspense>
      </div>
    </main>
  );
}