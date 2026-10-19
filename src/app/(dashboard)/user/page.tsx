import React from "react";
import TenantAnalytic from "@/components/analytics/tenantAnalytic";

export const metadata = {
  title: "Tenant Dashboard | Housing Management",
  description: "View your rental bookings, approvals, and payment analytics.",
};

export default function TenantPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <TenantAnalytic />
    </div>
  );
}
