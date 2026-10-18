import React from "react";
import AllRooms from "@/components/room/all-rooms";
import { DoorOpen } from "lucide-react";

export default function AllRoomsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 via-muted/20 to-background py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <DoorOpen className="w-3.5 h-3.5" />
            Verified Rental Rooms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore All Available Rooms
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Browse through individual private and shared rooms listed across properties. Check prices, seat availability, and view full room details.
          </p>
        </div>
      </div>

      {/* Main Content: Room Cards with Search, Filter & Pagination */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AllRooms />
      </main>
    </div>
  );
}
