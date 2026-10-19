import React from "react";
import LandlordAnalytic from "@/components/analytics/landlordAnalytic";

export const metadata = {
  title: "Landlord Dashboard | Housing Management",
  description: "Monitor properties, room occupancy, booking inquiries, and earnings.",
};

export default function LandlordPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <LandlordAnalytic />
    </div>
  );
}
