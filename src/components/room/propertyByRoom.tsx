"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetPropertyRoom, useGetSingleProperty } from "@/hooks";
import { Room } from "@/types/room.type";
import { Property } from "@/types/property.type";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DoorOpen,
  ArrowLeft,
  BedDouble,
  Users,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Banknote,
  Mail,
  Phone,
  AlertCircle,
  Home,
  ChevronRight,
  Info,
} from "lucide-react";

export default function PropertyByRoom() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId") || searchParams.get("id") || "";

  // Fetch rooms data using room hook
  const { data: roomResponse, isLoading: isRoomLoading, isError: isRoomError, refetch } =
    useGetPropertyRoom(propertyId);

  // Also fetch single property data as a reliable fallback for property context details
  const { data: propResponse, isLoading: isPropLoading } =
    useGetSingleProperty(propertyId);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Parse rooms array from various possible API response shapes
  const responseData = roomResponse?.data;
  let parsedRooms: Room[] = [];
  let propertyFromRoom: Property | undefined = undefined;

  if (Array.isArray(responseData)) {
    parsedRooms = responseData;
  } else if (responseData && typeof responseData === "object") {
    if (Array.isArray(responseData.rooms)) {
      parsedRooms = responseData.rooms;
    }
    propertyFromRoom = responseData.property || responseData;
  }

  // Fallback to property details from useGetSingleProperty
  const property: Property | undefined =
    propertyFromRoom?.title ? propertyFromRoom : propResponse?.data;

  // If parsedRooms is still empty, check if property has rooms array
  if (parsedRooms.length === 0 && property?.rooms && Array.isArray(property.rooms)) {
    parsedRooms = property.rooms;
  }

  const isLoading = isRoomLoading && isPropLoading;
  const isError = isRoomError && !property;

  const landlord = property?.landlord;
  const landlordUser = landlord?.user;
  const landlordName = landlord?.name || landlordUser?.name || "Verified Landlord";
  const landlordAvatar = landlordUser?.imageUrl;
  const thumbnail = property?.imageUrl?.[0];

  // No property ID provided
  if (!propertyId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">No Property Selected</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Please select a property from the listings to view its available rooms.
        </p>
        <div className="pt-2">
          <Link
            href="/properties"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Back navigation */}
        <div className="h-5 w-40 bg-muted rounded-md" />

        {/* Property overview banner skeleton */}
        <div className="h-32 bg-muted rounded-3xl w-full" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-56 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>

        {/* Room cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Failed to Load Rooms</h2>
        <p className="text-xs text-muted-foreground">
          There was an issue fetching the rooms for this property. Please try again.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
          <Link
            href={`/properties/${propertyId}`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Back to Property Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Top Back Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/properties/${propertyId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Property Details</span>
          </Link>

          <Link
            href="/properties"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            All Properties
          </Link>
        </div>

        {/* Property Overview Header Card */}
        {property && (
          <div className="p-4 sm:p-6 rounded-3xl bg-card border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border bg-muted shrink-0 shadow-xs">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Building2 className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-primary border-primary/30">
                    <Building2 className="w-3 h-3 mr-1" />
                    {property.city}
                  </Badge>

                  <Badge
                    className={`text-[10px] px-2 py-0.5 ${
                      property.isAvailable
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {property.isAvailable ? "Property Available" : "Booked"}
                  </Badge>
                </div>

                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate" title={property.title}>
                  {property.title}
                </h1>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    {property.address}, {property.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats / Property Total */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 w-full md:w-auto shrink-0 justify-between md:justify-start">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Full Property Rent</p>
                <p className="text-lg sm:text-xl font-extrabold text-primary">
                  ৳{property.rentPrice?.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">BDT / month</p>
              </div>

              <div className="text-right md:text-left">
                <p className="text-[11px] text-muted-foreground font-medium">Total Listed Rooms</p>
                <div className="flex items-center gap-1.5 text-lg sm:text-xl font-bold text-foreground">
                  <DoorOpen className="w-4 h-4 text-primary" />
                  <span>{parsedRooms.length || property.totalRooms}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Available for rent</p>
              </div>
            </div>
          </div>
        )}

        {/* Section Heading & Room Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <DoorOpen className="w-6 h-6 text-primary" />
              <span>Available Property Rooms</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select or inquire about individual rooms with dedicated monthly rates and seat capacities.
            </p>
          </div>

          <Badge variant="secondary" className="text-xs font-semibold self-start sm:self-auto px-3 py-1">
            {parsedRooms.length} {parsedRooms.length === 1 ? "Room Listed" : "Rooms Listed"}
          </Badge>
        </div>

        {/* Rooms Card Grid */}
        {parsedRooms.length === 0 ? (
          /* Empty State */
          <div className="p-12 sm:p-16 rounded-3xl border bg-card text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
              <DoorOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                No Individual Rooms Listed Yet
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The landlord has not listed separate room breakdowns for this property yet, or they may be currently occupied.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href={`/properties/${propertyId}`}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Back to Property Details
              </Link>
            </div>
          </div>
        ) : (
          /* Room Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parsedRooms.map((room, idx) => {
              const isAvailable =
                room.status === "AVAILABLE" ||
                !room.status ||
                room.status === "available";

              const seats = room.availableSeats || room.capacity || 1;

              return (
                <div
                  key={room.id || idx}
                  className="rounded-3xl border bg-card p-6 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-5 group"
                >
                  {/* Top: Room Number & Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/room/${room.id}`}
                          className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 hover:scale-105 transition-transform"
                        >
                          <DoorOpen className="w-4 h-4" />
                        </Link>
                        <div>
                          <Link href={`/room/${room.id}`}>
                            <h3 className="font-extrabold text-base text-foreground tracking-tight hover:text-primary transition-colors line-clamp-1">
                              Room {room.roomNumber || idx + 1}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-muted-foreground">
                            Unit ID: {room.roomNumber ? `RM-${room.roomNumber}` : `#${idx + 1}`}
                          </p>
                        </div>
                      </div>

                      <Badge
                        className={`text-[10px] font-semibold px-2.5 py-0.5 ${
                          isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isAvailable ? "Available" : "Booked"}
                      </Badge>
                    </div>

                    {/* Rent Price Box */}
                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground font-medium">Monthly Rent</span>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-primary">
                          ৳{room.rentAmount ? room.rentAmount.toLocaleString() : "Contact"}
                        </span>
                        <span className="text-[10px] text-muted-foreground"> / month</span>
                      </div>
                    </div>

                    {/* Room Specs */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-2xl border bg-background flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">Capacity</p>
                          <p className="text-xs font-bold text-foreground">
                            {seats} {seats === 1 ? "Seat" : "Seats"}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl border bg-background flex items-center gap-2.5">
                        <BedDouble className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">Room Type</p>
                          <p className="text-xs font-bold text-foreground truncate">
                            {seats > 1 ? "Shared" : "Private"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Features chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        ✓ Well-lit
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        ✓ Wi-Fi Access
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        ✓ 24/7 Security
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Buttons: View Details & Contact Landlord */}
                  <div className="pt-3 border-t flex items-center gap-2">
                    <Link
                      href={`/room/${room.id}`}
                      className={cn(
                        buttonVariants({ variant: "default", size: "sm" }),
                        "flex-1 text-xs h-9 font-semibold rounded-xl gap-1.5 shadow-xs justify-center flex items-center bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRoom(room)}
                      className="text-xs h-9 px-3 font-semibold rounded-xl gap-1.5 justify-center hover:border-primary hover:text-primary transition-colors"
                      title="Contact Landlord"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Inquire</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner to Back */}
        <div className="p-6 rounded-3xl bg-muted/30 border text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Have questions about the overall building, amenities, or want to rent the whole property?
          </p>
          <Link
            href={`/properties/${propertyId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>View Full Property Overview & Amenities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Room Inquiry & Landlord Contact Modal */}
      {selectedRoom && (
        <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
          <DialogContent className="w-full sm:max-w-md p-6">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                <DoorOpen className="h-4 w-4" />
                Room Inquiry
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Inquire About Room {selectedRoom.roomNumber}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Contact the landlord directly to schedule a visit or reserve this room.
              </DialogDescription>
            </DialogHeader>

            {/* Room Summary Card inside Modal */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5 my-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4 text-primary" />
                  Room {selectedRoom.roomNumber}
                </span>
                <span className="text-sm font-extrabold text-primary">
                  ৳{selectedRoom.rentAmount ? selectedRoom.rentAmount.toLocaleString() : "N/A"} / mo
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <span>Available Seats:</span>
                <span className="font-semibold text-foreground">
                  {selectedRoom.availableSeats || selectedRoom.capacity || 1} Persons
                </span>
              </div>

              {property?.title && (
                <div className="text-[11px] text-muted-foreground truncate border-t pt-2">
                  <span className="font-medium">Property: </span>
                  <span>{property.title}</span>
                </div>
              )}
            </div>

            {/* Landlord Contact Info */}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Landlord Contact
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border shadow-xs">
                  {landlordAvatar && <AvatarImage src={landlordAvatar} />}
                  <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                    {landlordName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {landlordName}
                    </p>
                    <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {landlord?.address || property?.city || "Verified Landlord"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {landlord?.contactNumber ? (
                  <a
                    href={`tel:${landlord.contactNumber}`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full text-xs h-10 font-semibold rounded-xl gap-2 shadow-xs justify-center flex items-center"
                    )}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Landlord ({landlord.contactNumber})</span>
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center">
                    Phone contact not provided by landlord.
                  </p>
                )}

                {landlord?.email && (
                  <a
                    href={`mailto:${landlord.email}?subject=Inquiry for Room ${selectedRoom.roomNumber} - ${property?.title || ""}&body=Hello ${landlordName}, I am interested in renting Room ${selectedRoom.roomNumber} at ${property?.title || ""}.`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full text-xs h-10 font-semibold rounded-xl gap-2 justify-center hover:border-primary hover:text-primary transition-colors flex items-center"
                    )}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email Inquiry</span>
                  </a>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
