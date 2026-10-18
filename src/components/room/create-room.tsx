"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useLanloardCreateRoom } from "@/hooks";
import { Property } from "@/types/property.type";
import { CreateRoomInput } from "@/types/room.type";
import {
  DoorOpen,
  Building2,
  BedDouble,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  MapPin,
  Banknote,
  Hash,
} from "lucide-react";

export interface CreateRoomProps {
  /** The target property object to which the room will belong */
  property?: Property | null;
  /** Target property ID (fallback if full property object is not available) */
  propertyId?: string;
  /** Controlled open state for the dialog */
  open?: boolean;
  /** Controlled open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Optional custom trigger node to render */
  trigger?: React.ReactNode;
  /** Optional callback fired upon successful room creation */
  onSuccess?: () => void;
}

const QUICK_ROOM_NUMBERS = ["101", "102", "103", "104", "105", "201", "202"];
const QUICK_SEATS = [1, 2, 3, 4];

export default function CreateRoom({
  property,
  propertyId: propId,
  open,
  onOpenChange,
  trigger,
  onSuccess,
}: CreateRoomProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const targetPropertyId = property?.id || propId || "";

  // Form states
  const [roomNumber, setRoomNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [availableSeats, setAvailableSeats] = useState("1");
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    title?: string;
    message: string;
  } | null>(null);

  const { mutate: createRoomMutation, isPending } = useLanloardCreateRoom();

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }

    if (!newOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setRoomNumber("");
    setRentAmount("");
    setAvailableSeats("1");
    setStatusMessage(null);
  };

  // Reset status on dialog open
  useEffect(() => {
    if (isOpen) {
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation
    const trimmedRoomNumber = roomNumber.trim();
    if (!trimmedRoomNumber) {
      const msg = "Please enter a room number or name (e.g. 105).";
      setStatusMessage({ type: "error", title: "Room Number Required", message: msg });
      toast.add({ title: "Validation Error", description: msg, type: "error" });
      return;
    }

    const rentPriceNum = Number(rentAmount);
    if (!rentPriceNum || rentPriceNum <= 0) {
      const msg = "Please enter a valid monthly rent amount greater than 0.";
      setStatusMessage({ type: "error", title: "Invalid Rent Amount", message: msg });
      toast.add({ title: "Validation Error", description: msg, type: "error" });
      return;
    }

    const seatsNum = Number(availableSeats);
    if (!seatsNum || seatsNum < 1) {
      const msg = "Available seats must be at least 1.";
      setStatusMessage({ type: "error", title: "Invalid Seat Count", message: msg });
      toast.add({ title: "Validation Error", description: msg, type: "error" });
      return;
    }

    if (!targetPropertyId) {
      const msg = "Target property ID is missing. Please select a valid property.";
      setStatusMessage({ type: "error", title: "Missing Property", message: msg });
      toast.add({ title: "Error", description: msg, type: "error" });
      return;
    }

    const payload: CreateRoomInput = {
      roomNumber: trimmedRoomNumber,
      rentAmount: rentPriceNum,
      availableSeats: seatsNum,
      propertyId: targetPropertyId,
    };

    createRoomMutation(payload, {
      onSuccess: () => {
        setStatusMessage({
          type: "success",
          title: "Room Added Successfully!",
          message: `Room "${trimmedRoomNumber}" has been registered for this property.`,
        });

        toast.add({
          title: "Room Created",
          description: `Room "${trimmedRoomNumber}" has been added successfully!`,
          type: "success",
        });

        onSuccess?.();

        // Brief delay before closing so the landlord sees the success checkmark
        setTimeout(() => {
          handleOpenChange(false);
        }, 600);
      },
      onError: (err: any) => {
        const errorMsg =
          err?.data?.message ||
          err?.message ||
          "Failed to add room. Please verify the input and try again.";

        setStatusMessage({
          type: "error",
          title: "Failed to Add Room",
          message: errorMsg,
        });

        toast.add({
          title: "Error",
          description: errorMsg,
          type: "error",
        });
      },
    });
  };

  const thumbnail = property?.imageUrl?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* If trigger provided or uncontrolled, render trigger button */}
      {!isControlled && (
        <DialogTrigger
          render={
            trigger ? (
              (trigger as React.ReactElement)
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Room</span>
              </Button>
            )
          }
        />
      )}

      <DialogContent className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <DoorOpen className="h-4 w-4" />
            Room Management
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Add New Room
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter the room number, monthly rental rate, and available seats for this property.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Property Preview Context Card */}
        {property && (
          <div className="flex items-center gap-3.5 p-3 rounded-2xl border bg-muted/40 mt-1">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border bg-muted shrink-0">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Target Property
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {property.totalRooms} Total Rooms
                </span>
              </div>
              <p className="font-semibold text-xs text-foreground truncate" title={property.title}>
                {property.title}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate">
                  {property.address}, {property.city}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* In-Dialog Status Alert Banner */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 animate-in fade-in-0 duration-200 mt-2 ${
              statusMessage.type === "error"
                ? "bg-destructive/10 text-destructive border-destructive/20 font-medium"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {statusMessage.type === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                {statusMessage.title && (
                  <p className="font-semibold text-xs">{statusMessage.title}</p>
                )}
                <p className="opacity-90 text-[11px]">{statusMessage.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:opacity-70 rounded-full transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Room Number */}
          <div className="space-y-2">
            <Label htmlFor="room-number" className="text-xs font-semibold flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-primary" />
              Room Number / Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="room-number"
              placeholder="e.g. 105, Room 201, Master Bed"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="text-xs h-9 bg-background"
              required
              autoFocus
            />

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-muted-foreground mr-1">Quick Select:</span>
              {QUICK_ROOM_NUMBERS.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRoomNumber(num)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                    roomNumber === num
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-border"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="space-y-1.5">
            <Label htmlFor="rent-amount" className="text-xs font-semibold flex items-center gap-1.5">
              <Banknote className="h-3.5 w-3.5 text-primary" />
              Monthly Rent (BDT) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                ৳
              </span>
              <Input
                id="rent-amount"
                type="number"
                min="1"
                placeholder="e.g. 12000"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="pl-7 text-xs h-9 bg-background"
                required
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Enter the monthly room rental price in Bangladeshi Taka.
            </p>
          </div>

          {/* Available Seats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="available-seats" className="text-xs font-semibold flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Available Seats / Capacity <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {availableSeats} {Number(availableSeats) === 1 ? "Seat" : "Seats"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                id="available-seats"
                type="number"
                min="1"
                max="20"
                placeholder="e.g. 3"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                className="text-xs h-9 bg-background"
                required
              />
              <div className="flex items-center gap-1 shrink-0">
                {QUICK_SEATS.map((seatCount) => (
                  <Button
                    key={seatCount}
                    type="button"
                    variant={Number(availableSeats) === seatCount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAvailableSeats(seatCount.toString())}
                    className="h-9 px-2.5 text-xs font-normal"
                  >
                    {seatCount} {seatCount === 1 ? "Seat" : "Seats"}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Total number of occupants or bed seats available in this room.
            </p>
          </div>

          {/* Hidden or read-only Property ID info */}
          <div className="p-2.5 rounded-xl bg-muted/20 border border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Property ID:</span>
            </span>
            <code className="font-mono text-[10px] bg-muted/60 px-1.5 py-0.5 rounded truncate max-w-[220px]" title={targetPropertyId}>
              {targetPropertyId || "No property selected"}
            </code>
          </div>

          {/* Dialog Action Footer */}
          <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending || !targetPropertyId}
              className="gap-2 font-semibold shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Room...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Room
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
