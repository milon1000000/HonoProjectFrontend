import ForgotPasswordForm from "@/components/form/forgot-form";
import React from "react";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}