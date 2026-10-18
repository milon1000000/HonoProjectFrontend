"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useGetPropertyRoom,
  useGetSingleProperty,
  useUpdateRoom,
  useDeleteRoom,
} from "@/hooks";
import { Room, UpdateRoomInput } from "@/types/room.type";
import { Property } from "@/types/property.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DoorOpen,
  ArrowLeft,
  Building2,
  MapPin,
  Pencil,
  Trash2,
  Search,
  BedDouble,
  Users,
  Plus,
  X,
  Loader2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Banknote,
  Hash,
  ExternalLink,
  Home,
} from "lucide-react";
import CreateRoom from "@/components/room/create-room";

export default function MyRooms() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId") || searchParams.get("id") || "";

  const {
    data: roomResponse,
    isLoading: isRoomLoading,
    isError: isRoomError,
    refetch: refetchRooms,
  } = useGetPropertyRoom(propertyId);

  const {
    data: propResponse,
    isLoading: isPropLoading,
    refetch: refetchProperty,
  } = useGetSingleProperty(propertyId);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // Extract rooms array safely from various possible API response shapes
  const responseData = roomResponse?.data;
  let rooms: Room[] = [];
  let propertyFromRoom: Property | undefined = undefined;

  if (Array.isArray(responseData)) {
    rooms = responseData;
  } else if (responseData && typeof responseData === "object") {
    if (Array.isArray(responseData.rooms)) {
      rooms = responseData.rooms;
    }
    propertyFromRoom = responseData.property || responseData;
  }

  // Parent property details
  const property: Property | undefined =
    propertyFromRoom?.title ? propertyFromRoom : propResponse?.data;

  // Fallback if rooms were attached directly on property
  if (rooms.length === 0 && property?.rooms && Array.isArray(property.rooms)) {
    rooms = property.rooms;
  }

  const isLoading = isRoomLoading && isPropLoading;
  const isError = isRoomError && !property;

  // Filter rooms by search term (room number, rent, status)
  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.toLowerCase();
    return (
      room.roomNumber?.toLowerCase().includes(term) ||
      room.rentAmount?.toString().includes(term) ||
      room.status?.toLowerCase().includes(term)
    );
  });

  const thumbnail = property?.imageUrl?.[0];

  // No property ID in URL
  if (!propertyId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">No Property Selected</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Please select a property from your listed properties to manage its rooms.
        </p>
        <div className="pt-2">
          <Link
            href="/landlord/create-property"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Go to My Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/landlord/create-property"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Properties</span>
        </Link>

        {property && (
          <Link
            href={`/properties/${property.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <span>View Public Property Listing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Property Context Header Banner */}
      {property && (
        <div className="p-5 sm:p-6 rounded-3xl bg-card border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border bg-muted shrink-0 shadow-xs">
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
                  {property.isAvailable ? "Available" : "Booked"}
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

          {/* Quick Stats & Add Room Button */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="text-left md:text-right">
              <p className="text-[11px] text-muted-foreground">Total Property Rent</p>
              <p className="text-base sm:text-lg font-extrabold text-primary">
                ৳{property.rentPrice?.toLocaleString()} / mo
              </p>
            </div>

            <Button
              onClick={() => setIsAddRoomOpen(true)}
              className="gap-2 text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </Button>
          </div>
        </div>
      )}

      {/* Table Search & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Rooms List
            </h2>
            <Badge variant="secondary" className="text-xs">
              {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage individual room units, rental prices, seat capacity, and availability.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search room number or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>
      </div>

      {/* Rooms Table */}
      <div className="border rounded-2xl bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[200px] text-xs font-semibold">Room Unit</TableHead>
              <TableHead className="text-xs font-semibold">Monthly Rent</TableHead>
              <TableHead className="text-xs font-semibold">Total Capacity</TableHead>
              <TableHead className="text-xs font-semibold">Available Seats</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-right text-xs font-semibold pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-xl" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 bg-muted rounded-full w-14" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 bg-muted rounded-full w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 bg-muted rounded w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              // Error State
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium text-foreground">
                      Failed to load rooms for this property.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        refetchRooms();
                        refetchProperty();
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRooms.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={6} className="h-52 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <DoorOpen className="h-10 w-10 text-muted-foreground/60 mb-1" />
                    <p className="text-sm font-semibold text-foreground">
                      {searchTerm ? "No matching rooms found" : "No rooms added yet"}
                    </p>
                    <p className="text-xs max-w-sm">
                      {searchTerm
                        ? "Try adjusting your search criteria."
                        : "Click 'Add New Room' button to add the first room unit to this property!"}
                    </p>
                    {!searchTerm && (
                      <Button
                        size="sm"
                        onClick={() => setIsAddRoomOpen(true)}
                        className="mt-2 gap-1.5 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Room</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Room Rows
              filteredRooms.map((room, idx) => {
                const isAvailable =
                  room.status === "AVAILABLE" ||
                  !room.status ||
                  room.status === "available";

                const capacity = room.capacity || 1;
                const availableSeats =
                  room.availableSeats !== undefined
                    ? room.availableSeats
                    : isAvailable
                    ? capacity
                    : 0;

                return (
                  <TableRow
                    key={room.id || idx}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Room Identifier */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          <DoorOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-xs">
                            Room {room.roomNumber}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {capacity > 1 ? "Shared Room" : "Private Room"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Monthly Rent */}
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">
                        ৳{room.rentAmount?.toLocaleString()}
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {" "}
                          / mo
                        </span>
                      </div>
                    </TableCell>

                    {/* Capacity */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{capacity} {capacity === 1 ? "Person" : "Persons"}</span>
                      </div>
                    </TableCell>

                    {/* Available Seats */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 font-medium ${
                          availableSeats > 0
                            ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            : "border-muted text-muted-foreground bg-muted"
                        }`}
                      >
                        {availableSeats} {availableSeats === 1 ? "Seat" : "Seats"} Vacant
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-medium ${
                          isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isAvailable ? "Available" : "Booked"}
                      </Badge>
                    </TableCell>

                    {/* Actions: Edit & Delete */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Public Room Page */}
                        <Link
                          href={`/room/${room.id}`}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "h-8 px-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                          )}
                          title="View public room page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRoom(room)}
                          className="h-8 px-2.5 text-xs gap-1 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingRoom(room)}
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Delete room"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Room Dialog */}
      {editingRoom && (
        <EditRoomDialog
          room={editingRoom}
          propertyTitle={property?.title}
          open={!!editingRoom}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingRoom(null);
          }}
        />
      )}

      {/* Delete Room Confirmation Dialog */}
      {deletingRoom && (
        <DeleteRoomDialog
          room={deletingRoom}
          propertyTitle={property?.title}
          open={!!deletingRoom}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingRoom(null);
          }}
        />
      )}

      {/* Add Room Modal Dialog */}
      {isAddRoomOpen && (
        <CreateRoom
          property={property}
          propertyId={propertyId}
          open={isAddRoomOpen}
          onOpenChange={setIsAddRoomOpen}
          onSuccess={() => {
            refetchRooms();
            refetchProperty();
          }}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   Edit Room Dialog Component
   ========================================================================== */
interface EditRoomDialogProps {
  room: Room;
  propertyTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditRoomDialog({
  room,
  propertyTitle,
  open,
  onOpenChange,
}: EditRoomDialogProps) {
  const [roomNumber, setRoomNumber] = useState(room.roomNumber || "");
  const [rentAmount, setRentAmount] = useState(room.rentAmount?.toString() || "");
  const [capacity, setCapacity] = useState(room.capacity?.toString() || "1");
  const [availableSeats, setAvailableSeats] = useState(
    room.availableSeats !== undefined ? room.availableSeats.toString() : "1"
  );
  const [status, setStatus] = useState<string>(room.status || "AVAILABLE");
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const { mutate: updateRoomMutation, isPending } = useUpdateRoom();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const trimmedNumber = roomNumber.trim();
    if (!trimmedNumber) {
      setStatusMessage({ type: "error", message: "Room number is required." });
      return;
    }

    const rentPriceNum = Number(rentAmount);
    if (!rentPriceNum || rentPriceNum <= 0) {
      setStatusMessage({ type: "error", message: "Please enter a valid rent price." });
      return;
    }

    const capacityNum = Number(capacity);
    if (!capacityNum || capacityNum <= 0) {
      setStatusMessage({ type: "error", message: "Capacity must be at least 1." });
      return;
    }

    const seatsNum = Number(availableSeats);
    if (isNaN(seatsNum) || seatsNum < 0) {
      setStatusMessage({ type: "error", message: "Available seats cannot be negative." });
      return;
    }

    const payload: UpdateRoomInput = {
      roomNumber: trimmedNumber,
      rentAmount: rentPriceNum,
      capacity: capacityNum,
      availableSeats: seatsNum,
      status,
    };

    updateRoomMutation(
      { id: room.id, payload },
      {
        onSuccess: () => {
          toast.add({
            title: "Room Updated",
            description: `Room "${trimmedNumber}" has been successfully updated!`,
            type: "success",
          });
          onOpenChange(false);
        },
        onError: (err: any) => {
          const msg =
            err?.data?.message ||
            err?.message ||
            "Failed to update room. Please try again.";
          setStatusMessage({ type: "error", message: msg });
          toast.add({
            title: "Update Failed",
            description: msg,
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md p-6">
        <DialogHeader className="border-b pb-4 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Pencil className="h-4 w-4" />
            Edit Room Unit
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Update Room {room.roomNumber}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {propertyTitle ? `Belongs to: ${propertyTitle}` : "Make changes to room pricing and occupancy."}
          </DialogDescription>
        </DialogHeader>

        {/* In-Dialog Alert Message */}
        {statusMessage && (
          <div
            className={`mt-3 p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2.5 animate-in fade-in-0 duration-200 ${
              statusMessage.type === "error"
                ? "bg-destructive/10 text-destructive border-destructive/20 font-medium"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{statusMessage.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:opacity-70 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Room Number */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-room-number" className="text-xs font-semibold flex items-center gap-1">
              <Hash className="h-3.5 w-3.5 text-primary" />
              Room Number / Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-room-number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 101 or Master Bed"
              required
            />
          </div>

          {/* Monthly Rent */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-rent-amount" className="text-xs font-semibold flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5 text-primary" />
              Monthly Rent (BDT) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-rent-amount"
              type="number"
              min="1"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          {/* Capacity & Available Seats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-capacity" className="text-xs font-semibold flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                Capacity (Persons) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-available-seats" className="text-xs font-semibold flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-primary" />
                Vacant Seats <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-available-seats"
                type="number"
                min="0"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Booking Status</Label>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <Button
                type="button"
                variant={status === "AVAILABLE" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("AVAILABLE")}
                className="text-xs h-9 justify-center"
              >
                Available for Rent
              </Button>
              <Button
                type="button"
                variant={status === "BOOKED" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("BOOKED")}
                className="text-xs h-9 justify-center"
              >
                Currently Booked
              </Button>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ==========================================================================
   Delete Room Confirmation Dialog
   ========================================================================== */
interface DeleteRoomDialogProps {
  room: Room;
  propertyTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteRoomDialog({
  room,
  propertyTitle,
  open,
  onOpenChange,
}: DeleteRoomDialogProps) {
  const { mutate: deleteRoomMutation, isPending } = useDeleteRoom();

  const handleDelete = () => {
    deleteRoomMutation(room.id, {
      onSuccess: () => {
        toast.add({
          title: "Room Deleted",
          description: `Room "${room.roomNumber}" has been deleted successfully.`,
          type: "success",
        });
        onOpenChange(false);
      },
      onError: (err: any) => {
        const msg =
          err?.data?.message ||
          err?.message ||
          "Failed to delete room. Please try again.";
        toast.add({
          title: "Delete Failed",
          description: msg,
          type: "error",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md p-6">
        <DialogHeader className="text-left space-y-2">
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Delete Room Unit
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete Room {room.roomNumber}? This unit will be removed from your property listing and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Room summary snippet */}
        <div className="p-3.5 rounded-2xl border bg-muted/30 my-2 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <DoorOpen className="w-4 h-4 text-primary" />
              Room {room.roomNumber}
            </span>
            <span className="text-primary font-bold">
              ৳{room.rentAmount?.toLocaleString()} / mo
            </span>
          </div>
          {propertyTitle && (
            <p className="text-[11px] text-muted-foreground truncate">
              Property: {propertyTitle}
            </p>
          )}
        </div>

        <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Room
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
