import React from "react";
import PropertyCard from "@/components/landloard/property-card";
import { Building2 } from "lucide-react";

export default function Properties() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 via-muted/20 to-background py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            Verified Rental Properties
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Find Your Dream Rental Home
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Browse through available rental apartments, houses, and rooms listed by verified landlords across various cities.
          </p>
        </div>
      </div>

      {/* Main Content: Properties Cards with Search & Pagination */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyCard />
      </main>
    </div>
  );
}
