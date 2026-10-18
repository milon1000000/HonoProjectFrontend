import React, { Suspense } from "react";
import PropertyByRoom from "@/components/room/propertyByRoom";

export default function PropertyRoom() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="space-y-4 animate-pulse max-w-md mx-auto">
            <div className="h-8 bg-muted rounded-xl w-48 mx-auto" />
            <div className="h-4 bg-muted rounded-md w-64 mx-auto" />
          </div>
        </div>
      }
    >
      <PropertyByRoom />
    </Suspense>
  );
}
