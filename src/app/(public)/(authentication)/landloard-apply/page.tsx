import LandlordForm from "@/components/form/landloard-form";
import React from "react";

export default function LandlordApplyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <LandlordForm />
      </div>
    </main>
  );
}