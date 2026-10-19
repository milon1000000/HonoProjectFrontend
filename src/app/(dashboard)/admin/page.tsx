import React from "react";
import AdminAnalytic from "@/components/analytics/adminAnalytic";

export const metadata = {
  title: "Admin Dashboard | Housing Management",
  description: "Platform analytics, landlord approvals, booking flow, and revenue audit.",
};

export default function AdminPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminAnalytic />
    </div>
  );
}
