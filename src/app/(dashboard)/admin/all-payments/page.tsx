import React, { Suspense } from "react";
import AllPayments from "@/components/payment/allPayment";
import { Receipt } from "lucide-react";

export const metadata = {
  title: "All Payments | Admin Dashboard",
  description: "View and manage all payment transactions, revenue, and invoices",
};

export default function AdminAllPaymentsPage() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Receipt className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              All Payments Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track and audit all room booking payments, bKash transactions, collected revenue, and refunds.
          </p>
        </div>
      </div>

      {/* Main Table Content */}
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading payments...
          </div>
        }
      >
        <AllPayments />
      </Suspense>
    </div>
  );
}
