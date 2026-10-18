import React, { Suspense } from "react";
import MyRooms from "@/components/room/my-rooms";

export default function PropertyRooms() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <Suspense
        fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-36 bg-muted rounded-md" />
            <div className="h-28 bg-muted rounded-3xl w-full" />
            <div className="h-64 bg-muted rounded-2xl w-full" />
          </div>
        }
      >
        <MyRooms />
      </Suspense>
    </div>
  );
}
