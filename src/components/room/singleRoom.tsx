"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetSingleRoom } from "@/hooks";
import { Room } from "@/types/room.type";
import { Property } from "@/types/property.type";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookingDialog from "@/components/booking/booking-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DoorOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Building2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Mail,
  Phone,
  ImageIcon,
  Maximize2,
  AlertCircle,
  Home,
  Check,
  Share2,
  Users,
  Banknote,
  Hash,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface SingleRoomProps {
  id?: string;
}

export default function SingleRoom({ id: propId }: SingleRoomProps) {
  const params = useParams();
  const id = propId || (params?.id as string);

  const { data, isLoading, isError, refetch } = useGetSingleRoom(id);
  const room: Room | undefined = data?.data;
  const property: Property | undefined = room?.property;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const images = property?.imageUrl || [];

  // Reset image index when room changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [room?.id]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (images.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.add({
        title: "Link Copied",
        description: "Room listing link copied to clipboard!",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Navigation skeleton */}
        <div className="h-5 w-44 bg-muted rounded-md" />

        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-9 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>

        {/* Gallery skeleton */}
        <div className="h-[360px] sm:h-[460px] bg-muted rounded-3xl w-full" />

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-muted rounded-2xl" />
            <div className="h-44 bg-muted rounded-2xl" />
          </div>
          <div className="h-80 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (isError || !room) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Room Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The room listing you are looking for may have been removed or is unavailable.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
          <Link
            href="/properties"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const landlord = property?.landlord;
  const landlordUser = landlord?.user;
  const landlordName = landlord?.name || landlordUser?.name || "Verified Landlord";
  const landlordAvatar = landlordUser?.imageUrl;
  const currentImage = images[activeImageIndex] || images[0];

  const isRoomAvailable =
    room.status === "AVAILABLE" ||
    !room.status ||
    room.status === "available";

  const totalCapacity = room.capacity || 1;
  const availableSeatsCount =
    room.availableSeats !== undefined ? room.availableSeats : isRoomAvailable ? 1 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Navigation Breadcrumb & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {room.propertyId && (
              <Link
                href={`/properties/rooms?propertyId=${room.propertyId}`}
                className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>All Rooms in this Property</span>
              </Link>
            )}

            {property && (
              <>
                <span className="text-muted-foreground/60">•</span>
                <Link
                  href={`/properties/${room.propertyId}`}
                  className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[200px]"
                >
                  {property.title}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 px-3 text-xs gap-1.5 rounded-lg"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Share Room</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Title, Badges & Room Identification */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Availability Badge */}
            <Badge
              className={`text-xs font-semibold px-3 py-1 ${
                isRoomAvailable
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isRoomAvailable ? "Available for Rent" : "Currently Booked"}
            </Badge>

            {/* Room Number Badge */}
            <Badge variant="outline" className="text-xs px-2.5 py-1 text-primary border-primary/30 font-bold">
              <DoorOpen className="w-3.5 h-3.5 mr-1" />
              Room {room.roomNumber}
            </Badge>

            {/* City Badge */}
            {property?.city && (
              <Badge variant="outline" className="text-xs px-2.5 py-1 text-muted-foreground">
                <Building2 className="w-3 h-3 mr-1 text-primary" />
                {property.city}
              </Badge>
            )}

            {/* Room Type Pill */}
            <Badge variant="secondary" className="text-xs px-2.5 py-1">
              <BedDouble className="w-3.5 h-3.5 mr-1 text-primary" />
              {totalCapacity > 1 ? "Shared Room" : "Private Single Room"}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Room {room.roomNumber}</span>
            {property?.title && (
              <span className="text-muted-foreground font-normal text-xl sm:text-2xl">
                - {property.title}
              </span>
            )}
          </h1>

          {property && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>
                {property.address}, {property.city}
              </span>
            </div>
          )}
        </div>

        {/* Property & Room Image Gallery / Slider */}
        <div className="space-y-3">
          <div className="relative h-[360px] sm:h-[480px] lg:h-[520px] w-full rounded-3xl overflow-hidden border bg-muted shadow-xs group">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={`Room ${room.roomNumber} - Photo ${activeImageIndex + 1}`}
                fill
                priority
                className="object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <DoorOpen className="w-12 h-12" />
                <p className="text-xs">No photos uploaded for this property</p>
              </div>
            )}

            {/* Overlaid Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

            {/* Photo Counter Pill (Top-Left) */}
            {images.length > 0 && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>
                  {activeImageIndex + 1} / {images.length} Photos
                </span>
              </div>
            )}

            {/* Fullscreen Button (Top-Right) */}
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-sm"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Previous Image Navigation */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Image Navigation */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Dot Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeImageIndex === idx
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to photo ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 sm:h-20 w-24 sm:w-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-primary ring-2 ring-primary/30 scale-102 opacity-100 shadow-sm"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Details Grid: Left Content (2 Cols) + Right Sidebar (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Details Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metrics Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-card border shadow-xs">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Room Rent</p>
                <p className="text-xl sm:text-2xl font-extrabold text-primary">
                  ৳{room.rentAmount?.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">BDT per month</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Total Capacity</p>
                <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-extrabold text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{totalCapacity}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {totalCapacity === 1 ? "Person" : "Persons"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Available Seats</p>
                <p className={`text-xl sm:text-2xl font-extrabold ${availableSeatsCount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                  {availableSeatsCount} Seats
                </p>
                <p className="text-[11px] text-muted-foreground">Ready to occupy</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <p className="text-xl sm:text-2xl font-extrabold capitalize text-emerald-600 dark:text-emerald-400">
                  {isRoomAvailable ? "Available" : "Booked"}
                </p>
                <p className="text-[11px] text-muted-foreground">Booking status</p>
              </div>
            </div>

            {/* Room Specifications & Features */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border shadow-xs space-y-5">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-primary" />
                Room Features & Facilities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-xs sm:text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Room Number</p>
                    <p className="text-xs text-muted-foreground">Unit {room.roomNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-xs sm:text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Bed Setup</p>
                    <p className="text-xs text-muted-foreground">
                      {totalCapacity > 1 ? `Shared Bedding (${totalCapacity} Beds)` : "Private Single Bed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-xs sm:text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Seat Availability</p>
                    <p className="text-xs text-muted-foreground">
                      {availableSeatsCount} out of {totalCapacity} seats vacant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-xs sm:text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Monthly Rent</p>
                    <p className="text-xs text-muted-foreground">৳{room.rentAmount?.toLocaleString()} BDT / month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Property Overview Card */}
            {property && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      About The Property
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Building overview, description, and community features.
                    </p>
                  </div>

                  <Link
                    href={`/properties/${property.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "text-xs gap-1.5 shrink-0 hover:border-primary hover:text-primary transition-colors"
                    )}
                  >
                    <span>View Property Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Property Description */}
                {property.description && (
                  <div className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </div>
                )}

                {/* Building Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Building Amenities ({property.amenities.length})
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {property.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs font-medium text-foreground"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Sticky Landlord & Booking Card */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="p-6 sm:p-7 rounded-3xl bg-card border shadow-xs space-y-6">
              {/* Rent summary */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Room Monthly Rent</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-primary">
                    ৳{room.rentAmount?.toLocaleString()}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground"> / month</span>
                </div>
                <div className="pt-1">
                  <Badge
                    className={`text-xs px-2.5 py-0.5 ${
                      isRoomAvailable
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isRoomAvailable ? `${availableSeatsCount} Seats Available` : "Currently Booked"}
                  </Badge>
                </div>

                {/* Instant Booking Dialog Button */}
                <div className="pt-3">
                  <BookingDialog room={room} property={property} />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Landlord Contact Info */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Landlord Details
                </p>

                <div className="flex items-center gap-3.5">
                  <Avatar className="h-12 w-12 border shadow-xs">
                    {landlordAvatar && <AvatarImage src={landlordAvatar} />}
                    <AvatarFallback className="font-bold text-sm bg-primary/10 text-primary">
                      {landlordName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate">
                        {landlordName}
                      </p>
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {landlord?.address || property?.city || "Verified Landlord"}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px] text-primary border-primary/30">
                      Verified Owner
                    </Badge>
                  </div>
                </div>

                {/* Direct Contact Buttons */}
                <div className="space-y-2.5 pt-2">
                  {landlord?.contactNumber && (
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
                  )}

                  {landlord?.email && (
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        landlord.email
                      )}&su=${encodeURIComponent(
                        `Inquiry for Room ${room.roomNumber} - ${property?.title || ""}`
                      )}&body=${encodeURIComponent(
                        `Hello ${landlordName}, I would like to inquire about Room ${room.roomNumber} at ${property?.title || ""}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
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

              {/* Trust & Safety Assurance */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Direct connection with verified property owner. No middleman charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-5xl p-4 bg-black/95 text-white border-none sm:rounded-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>
                  Room {room.roomNumber} - Photo {activeImageIndex + 1} of {images.length}
                </span>
              </DialogTitle>
            </div>

            <div className="relative h-[60vh] sm:h-[75vh] w-full my-2">
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={`Fullscreen photo ${activeImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails in lightbox */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2">
                {images.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-primary ring-2 ring-primary/50 opacity-100"
                        : "border-transparent opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Lightbox thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

