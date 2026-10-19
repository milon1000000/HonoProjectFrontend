import React, { Suspense } from "react";
import AllBooking from "@/components/booking/allBooking";
import { CalendarCheck } from "lucide-react";

export const metadata = {
  title: "All Bookings | Admin Dashboard",
  description: "View and manage all tenant bookings and payments",
};

export default function AdminAllBookingPage() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              All Bookings Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View, track, and manage all room booking requests and payment statuses across the platform.
          </p>
        </div>
      </div>

      {/* Main Table Data Content */}
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading bookings...
          </div>
        }
      >
        <AllBooking />
      </Suspense>
    </div>
  );
}
