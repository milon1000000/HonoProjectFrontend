import LoginForm from "@/components/form/login-form";
import React, { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-4 md:p-8 bg-muted/40">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
