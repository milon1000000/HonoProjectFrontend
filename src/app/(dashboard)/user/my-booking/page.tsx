import React, { Suspense } from "react";
import BookingCard from "@/components/booking/booking-card";
import { Calendar, ShieldCheck } from "lucide-react";

export default function Booking() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 via-muted/20 to-background py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Rental Management</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            My Room Bookings
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Review your rental room bookings, complete your bKash payment, and track your move-in schedule directly with verified landlords.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="space-y-4 animate-pulse">
              <div className="h-12 bg-muted rounded-2xl w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-muted rounded-3xl" />
                <div className="h-64 bg-muted rounded-3xl" />
              </div>
            </div>
          }
        >
          <BookingCard />
        </Suspense>
      </main>
    </div>
  );
}
