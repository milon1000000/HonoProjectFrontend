import React from "react";
import { RegisterForm } from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-4 md:p-8 bg-muted/40">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <RegisterForm />
      </div>
    </main>
  );
}