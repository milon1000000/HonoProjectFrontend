"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyProperty, useUpdateProperty, useDeleteProperty } from "@/hooks";
import { Property } from "@/types/property.type";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  Building2,
  MapPin,
  Pencil,
  Trash2,
  Search,
  BedDouble,
  Sparkles,
  Plus,
  X,
  Upload,
  Loader2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Home,
  DoorOpen,
} from "lucide-react";
import CreateRoom from "@/components/room/create-room";

const SUGGESTED_AMENITIES = [
  "ওয়াই-ফাই",
  "এসি",
  "পার্কিং",
  "লিফট",
  "সিসিটিভি",
  "জেনারেটর",
  "২৪ ঘণ্টা নিরাপত্তা",
];

export default function MyProperty() {
  const { data, isLoading, isError, refetch } = useGetMyProperty();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [addingRoomProperty, setAddingRoomProperty] = useState<Property | null>(null);

  const properties: Property[] = data?.data || [];

  const filteredProperties = properties.filter((property) => {
    const term = searchTerm.toLowerCase();
    return (
      property.title?.toLowerCase().includes(term) ||
      property.city?.toLowerCase().includes(term) ||
      property.address?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              My Listed Properties
            </h2>
            <Badge variant="secondary" className="text-xs">
              {properties.length} {properties.length === 1 ? "Listing" : "Listings"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage, update, or remove your published properties.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by title, city, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-2xl bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[300px] text-xs font-semibold">Property</TableHead>
              <TableHead className="text-xs font-semibold">Monthly Rent</TableHead>
              <TableHead className="text-xs font-semibold">Rooms</TableHead>
              <TableHead className="text-xs font-semibold">Amenities</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Created Date</TableHead>
              <TableHead className="text-right text-xs font-semibold pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Skeleton Loading Rows
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-14 bg-muted rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
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
                    <div className="flex gap-1">
                      <div className="h-5 bg-muted rounded-full w-12" />
                      <div className="h-5 bg-muted rounded-full w-12" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 bg-muted rounded-full w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 bg-muted rounded w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              // Error State
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium text-foreground">
                      Failed to load your properties.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProperties.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <Home className="h-10 w-10 text-muted-foreground/60 mb-1" />
                    <p className="text-sm font-semibold text-foreground">
                      {searchTerm ? "No matching properties found" : "No properties listed yet"}
                    </p>
                    <p className="text-xs max-w-sm">
                      {searchTerm
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "Click the 'Create Property' button above to list your first rental property!"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Property Rows
              filteredProperties.map((property) => {
                const thumbnail = property.imageUrl?.[0];
                return (
                  <TableRow key={property.id} className="hover:bg-muted/30 transition-colors">
                    {/* Property Thumbnail & Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-14 rounded-lg overflow-hidden border bg-muted shrink-0">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Building2 className="w-5 h-5" />
                            </div>
                          )}
                          {property.imageUrl && property.imageUrl.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-medium">
                              +{property.imageUrl.length - 1}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-xs truncate max-w-[220px]" title={property.title}>
                            {property.title}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 truncate">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {property.address}, {property.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Rent */}
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">
                        ৳{property.rentPrice?.toLocaleString()}
                        <span className="text-[10px] text-muted-foreground font-normal"> / mo</span>
                      </div>
                    </TableCell>

                    {/* Rooms */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BedDouble className="h-3.5 w-3.5 text-foreground/70" />
                        <span>{property.totalRooms} Rooms</span>
                      </div>
                    </TableCell>

                    {/* Amenities */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {property.amenities && property.amenities.length > 0 ? (
                          <>
                            {property.amenities.slice(0, 2).map((amenity, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 bg-muted/50 font-normal"
                              >
                                {amenity}
                              </Badge>
                            ))}
                            {property.amenities.length > 2 && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0.5 font-normal"
                                title={property.amenities.slice(2).join(", ")}
                              >
                                +{property.amenities.length - 2}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={property.isAvailable ? "default" : "secondary"}
                        className={`text-[10px] font-medium ${
                          property.isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {property.isAvailable ? "Available" : "Booked"}
                      </Badge>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {property.createdAt
                            ? new Date(property.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/landlord/create-property/rooms?propertyId=${property.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "h-8 px-2.5 text-xs gap-1.5 hover:border-primary hover:text-primary transition-colors flex items-center shrink-0"
                          )}
                          title="View and manage all rooms of this property"
                        >
                          <DoorOpen className="h-3.5 w-3.5 text-primary" />
                          <span>Rooms</span>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddingRoomProperty(property)}
                          className="h-8 px-2.5 text-xs gap-1 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary transition-colors"
                          title="Add Room to this property"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Room</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProperty(property)}
                          className="h-8 px-2.5 text-xs gap-1 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingProperty(property)}
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
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

      {/* Edit Property Modal Dialog */}
      {editingProperty && (
        <EditPropertyDialog
          property={editingProperty}
          open={!!editingProperty}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingProperty(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deletingProperty && (
        <DeletePropertyDialog
          property={deletingProperty}
          open={!!deletingProperty}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingProperty(null);
          }}
        />
      )}

      {/* Create Room Modal Dialog */}
      {addingRoomProperty && (
        <CreateRoom
          property={addingRoomProperty}
          open={!!addingRoomProperty}
          onOpenChange={(isOpen) => {
            if (!isOpen) setAddingRoomProperty(null);
          }}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   Edit Property Dialog Component
   ========================================================================== */
interface EditPropertyDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditPropertyDialog({
  property,
  open,
  onOpenChange,
}: EditPropertyDialogProps) {
  const [title, setTitle] = useState(property.title || "");
  const [description, setDescription] = useState(property.description || "");
  const [address, setAddress] = useState(property.address || "");
  const [city, setCity] = useState(property.city || "");
  const [rentPrice, setRentPrice] = useState(property.rentPrice?.toString() || "");
  const [totalRooms, setTotalRooms] = useState(property.totalRooms?.toString() || "");
  const [amenities, setAmenities] = useState<string[]>(property.amenities || []);
  const [isAvailable, setIsAvailable] = useState<boolean>(property.isAvailable ?? true);
  const [amenityInput, setAmenityInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updatePropertyMutation, isPending } = useUpdateProperty();

  // Reset previews on unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleAddAmenity = () => {
    const trimmed = amenityInput.trim();
    if (!trimmed) return;

    const items = trimmed
      .split(",")
      .map((item) => item.trim())
      .filter((item) => Boolean(item) && !amenities.includes(item));

    if (items.length > 0) {
      setAmenities((prev) => [...prev, ...items]);
    }
    setAmenityInput("");
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setAmenities((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQuickAdd = (item: string) => {
    if (!amenities.includes(item)) {
      setAmenities((prev) => [...prev, item]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const totalCount = selectedFiles.length + files.length;

    if (totalCount > 5) {
      setStatusMessage({
        type: "error",
        message: "You can upload a maximum of 5 replacement images.",
      });
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index]);
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (title.trim().length < 3) {
      setStatusMessage({ type: "error", message: "Title must be at least 3 characters long." });
      return;
    }

    if (description.trim().length < 10) {
      setStatusMessage({ type: "error", message: "Description must be at least 10 characters long." });
      return;
    }

    if (address.trim().length < 5) {
      setStatusMessage({ type: "error", message: "Address must be at least 5 characters long." });
      return;
    }

    if (city.trim().length < 2) {
      setStatusMessage({ type: "error", message: "City is required." });
      return;
    }

    const rentPriceNum = Number(rentPrice);
    if (!rentPriceNum || rentPriceNum <= 0) {
      setStatusMessage({ type: "error", message: "Please enter a valid positive rent price." });
      return;
    }

    const totalRoomsNum = Number(totalRooms);
    if (!totalRoomsNum || totalRoomsNum <= 0) {
      setStatusMessage({ type: "error", message: "Please enter a valid number of rooms." });
      return;
    }

    // Include any typed amenity remaining in input
    let finalAmenities = [...amenities];
    if (amenityInput.trim()) {
      const extra = amenityInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => Boolean(s) && !finalAmenities.includes(s));
      finalAmenities = [...finalAmenities, ...extra];
    }

    // Prepare update payload
    const propertyData = {
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      rentPrice: rentPriceNum,
      totalRooms: totalRoomsNum,
      amenities: finalAmenities,
      isAvailable,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(propertyData));
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    updatePropertyMutation(
      { id: property.id, payload: formData },
      {
        onSuccess: () => {
          toast.add({
            title: "Property Updated",
            description: "Property has been successfully updated!",
            type: "success",
          });
          onOpenChange(false);
        },
        onError: (err: any) => {
          const msg =
            err?.data?.message ||
            err?.message ||
            "Failed to update property. Please try again.";
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
      <DialogContent className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Pencil className="h-4 w-4" />
            Edit Property Listing
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Update Property
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Make changes to your property listing details, pricing, and amenities.
          </DialogDescription>
        </DialogHeader>

        {/* Status / Error Banner */}
        {statusMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2.5 animate-in fade-in-0 duration-200 ${
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
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title" className="text-xs font-semibold">
              Property Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. আধুনিক বিলাসবহুল অ্যাপার্টমেন্ট"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description" className="text-xs font-semibold">
              Description <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="edit-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the property..."
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-address" className="text-xs font-semibold">
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. বাড়ি ১২, রোড ৫, সেক্টর ৩"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-city" className="text-xs font-semibold">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. ঢাকা"
                required
              />
            </div>
          </div>

          {/* Rent, Rooms, Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-rentPrice" className="text-xs font-semibold">
                Rent Price (BDT) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-rentPrice"
                type="number"
                min="1"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-totalRooms" className="text-xs font-semibold">
                Total Rooms <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-totalRooms"
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Availability Status</Label>
              <div className="pt-1.5">
                <Button
                  type="button"
                  variant={isAvailable ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className="w-full text-xs h-9 justify-center"
                >
                  {isAvailable ? "Available for Rent" : "Currently Booked"}
                </Button>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Amenities (সুবিধাসমূহ)
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {amenities.length} added
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="যেমন: ওয়াই-ফাই, এসি, পার্কিং, লিফট (লিখে Enter চাপুন)"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAmenity}
                className="shrink-0 gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>

            {/* Chips */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {amenities.map((item, index) => (
                  <Badge
                    key={`${item}-${index}`}
                    variant="secondary"
                    className="gap-1 pl-2.5 pr-1 py-1 text-xs font-normal bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="hover:bg-primary/20 rounded-full p-0.5 text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick add */}
            <div className="flex flex-wrap gap-1 pt-1">
              {SUGGESTED_AMENITIES.map((suggestion) => {
                const isAlreadyAdded = amenities.includes(suggestion);
                return (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => handleQuickAdd(suggestion)}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                      isAlreadyAdded
                        ? "opacity-40 cursor-not-allowed bg-muted border-transparent"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-border"
                    }`}
                  >
                    + {suggestion}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current & New Photos */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              Property Photos
            </Label>

            {/* Existing images */}
            {property.imageUrl && property.imageUrl.length > 0 && selectedFiles.length === 0 && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Current Photos:</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {property.imageUrl.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 rounded-lg overflow-hidden border bg-muted"
                    >
                      <Image
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new images box (optional) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-1 bg-muted/10 border-border"
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="text-xs">
                <span className="font-semibold text-primary">Click to upload new photos</span>
                <span className="text-muted-foreground"> (optional)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Uploading new photos will replace current photos (max 5)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Selected new previews */}
            {filePreviews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                {filePreviews.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group h-16 rounded-lg overflow-hidden border bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`New preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dialog Action Footer */}
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
   Delete Property Confirmation Dialog
   ========================================================================== */
interface DeletePropertyDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeletePropertyDialog({
  property,
  open,
  onOpenChange,
}: DeletePropertyDialogProps) {
  const { mutate: deletePropertyMutation, isPending } = useDeleteProperty();

  const handleDelete = () => {
    deletePropertyMutation(property.id, {
      onSuccess: () => {
        toast.add({
          title: "Property Deleted",
          description: `"${property.title}" has been deleted successfully.`,
          type: "success",
        });
        onOpenChange(false);
      },
      onError: (err: any) => {
        const msg =
          err?.data?.message ||
          err?.message ||
          "Failed to delete property. Please try again.";
        toast.add({
          title: "Delete Failed",
          description: msg,
          type: "error",
        });
      },
    });
  };

  const thumbnail = property.imageUrl?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md p-6">
        <DialogHeader className="text-left space-y-2">
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Delete Property Listing
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete this property? This will remove the listing from searches and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Property summary card */}
        <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30 my-2">
          <div className="relative w-14 h-12 rounded-lg overflow-hidden border bg-muted shrink-0">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Building2 className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs text-foreground truncate">
              {property.title}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {property.address}, {property.city}
            </p>
            <p className="text-xs font-semibold text-primary mt-0.5">
              ৳{property.rentPrice?.toLocaleString()} / mo
            </p>
          </div>
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
                Delete Property
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
