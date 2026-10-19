import React, { Suspense } from "react";
import MyPayments from "@/components/payment/myPayments";
import { Receipt } from "lucide-react";

export const metadata = {
  title: "My Payments | Tenant Dashboard",
  description: "View and track all your room rental payments and transaction history.",
};

export default function UserMyPaymentsPage() {
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
              My Payment History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track all your room rental payments, transaction invoices, and pending bKash dues.
          </p>
        </div>
      </div>

      {/* Main Table Content */}
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading your payment history...
          </div>
        }
      >
        <MyPayments />
      </Suspense>
    </div>
  );
}
