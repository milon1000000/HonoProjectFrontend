"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useBooking, useGetMe } from "@/hooks";
import { Room } from "@/types/room.type";
import { Property } from "@/types/property.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "cn";
import {
  Calendar,
  DoorOpen,
  Users,
  Banknote,
  Building2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  LogIn,
  Info,
} from "lucide-react";

interface BookingDialogProps {
  room: Room;
  property?: Property;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function BookingDialog({
  room,
  property,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: BookingDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const currentUser = userData?.data;
  const isLoggedIn = Boolean(currentUser);
  const isTenant = currentUser?.role === "TENANT";

  // Form states
  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);

  const maxSeats = Math.max(1, room.availableSeats ?? room.capacity ?? 1);
  const [seatCount, setSeatCount] = useState<number>(1);

  const { mutate: createBooking, isPending } = useBooking();

  const totalRent = (room.rentAmount || 0) * seatCount;
  const isRoomAvailable =
    room.status === "AVAILABLE" ||
    !room.status ||
    room.status === "available";

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.add({
        title: "Login Required",
        description: "Please login with your tenant account to book a room.",
        type: "error",
      });
      router.push(`/login?redirect=/room/${room.id}`);
      return;
    }

    if (!startDate) {
      toast.add({
        title: "Start Date Required",
        description: "Please select when you want your booking to start.",
        type: "error",
      });
      return;
    }

    const payload = {
      propertyId: room.propertyId || property?.id || "",
      roomId: room.id,
      startDate: new Date(startDate).toISOString(),
      seatCount: Number(seatCount),
    };

    createBooking(payload, {
      onSuccess: (res: any) => {
        toast.add({
          title: "Booking Requested",
          description:
            res?.message ||
            "Your room booking request was submitted successfully! Redirecting to booking page...",
          type: "success",
        });
        setIsOpen(false);
        // Navigate to my-booking page under user
        router.push("/user/my-booking");
      },
      onError: (err: any) => {
        const errorMsg =
          err?.data?.message ||
          err?.message ||
          "Failed to submit booking. Please try again.";
        toast.add({
          title: "Booking Failed",
          description: errorMsg,
          type: "error",
        });
      },
    });
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button
          type="button"
          size="lg"
          onClick={() => setIsOpen(true)}
          disabled={!isRoomAvailable || (room.availableSeats !== undefined && room.availableSeats <= 0)}
          className="w-full h-12 text-sm font-bold rounded-2xl gap-2 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <DoorOpen className="w-5 h-5" />
          <span>{isRoomAvailable ? "Book This Room Now" : "Currently Unavailable"}</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>


      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border shadow-xl bg-card">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-b space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-[10px] font-bold px-2 py-0.5",
                isRoomAvailable
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isRoomAvailable ? "Available for Booking" : "Booked"}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-primary border-primary/30 font-semibold">
              Unit {room.roomNumber}
            </Badge>
          </div>

          <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Book Room {room.roomNumber}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {property?.title || "Rental Property"} • {property?.city || "City"}
          </DialogDescription>
        </div>

        {/* Room Mini Summary */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/50">
            <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-muted shrink-0 border">
              {property?.imageUrl?.[0] ? (
                <Image
                  src={property.imageUrl[0]}
                  alt={`Room ${room.roomNumber}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/40">
                  <DoorOpen className="w-7 h-7" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {property?.title || `Room ${room.roomNumber}`}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {property?.address || "Location details"}
              </p>
              <div className="flex items-center gap-3 pt-0.5 text-xs">
                <span className="font-extrabold text-primary">
                  ৳{room.rentAmount?.toLocaleString()} <span className="font-normal text-[10px] text-muted-foreground">/ seat / mo</span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-[11px]">
                  {maxSeats} {maxSeats === 1 ? "seat" : "seats"} vacant
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="booking-form" onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Move-in / Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="rounded-xl h-10 text-xs sm:text-sm bg-background"
              />
              <p className="text-[11px] text-muted-foreground">
                Select the starting date for your lease/occupancy.
              </p>
            </div>

            {/* Seat Count (if room has capacity > 1) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="seatCount" className="text-xs font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Number of Seats
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Max: {maxSeats} {maxSeats === 1 ? "seat" : "seats"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  id="seatCount"
                  type="number"
                  min={1}
                  max={maxSeats}
                  value={seatCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setSeatCount(Math.max(1, Math.min(val, maxSeats)));
                    }
                  }}
                  className="rounded-xl h-10 text-xs sm:text-sm bg-background w-28"
                  required
                />
                <span className="text-xs text-muted-foreground">
                  {seatCount === 1 ? "Seat chosen" : "Seats chosen"}
                </span>
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Monthly Rent per seat</span>
                <span className="font-medium text-foreground">৳{room.rentAmount?.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Seats to book</span>
                <span className="font-medium text-foreground">× {seatCount}</span>
              </div>

              <div className="h-px bg-border my-1" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-primary" />
                  Total Monthly Rent
                </span>
                <span className="text-lg font-extrabold text-primary">
                  ৳{totalRent.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-muted-foreground">BDT</span>
                </span>
              </div>
            </div>

            {/* Auth notice if not logged in */}
            {!isLoggedIn && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="text-[11px]">
                  You must be logged in as a Tenant to book. If you confirm, you will be redirected to the login page.
                </p>
              </div>
            )}

            {isLoggedIn && !isTenant && (
              <div className="p-3 rounded-xl bg-muted border text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <p className="text-[11px]">
                  You are currently logged in as {currentUser?.role}. Only tenants can book rental rooms.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-muted/30 border-t flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
            className="rounded-xl text-xs h-10 px-4"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="booking-form"
            disabled={isPending || !isRoomAvailable || (isLoggedIn && !isTenant)}
            className="rounded-xl text-xs h-10 font-bold px-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Booking...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Book Room
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
