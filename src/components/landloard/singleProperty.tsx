"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetSingleProperty } from "@/hooks";
import { Property } from "@/types/property.type";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
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
  DoorOpen,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface SinglePropertyProps {
  id?: string;
}

export default function SingleProperty({ id: propId }: SinglePropertyProps) {
  const params = useParams();
  const id = propId || (params?.id as string);

  const { data, isLoading, isError, refetch } = useGetSingleProperty(id);
  const property: Property | undefined = data?.data;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const images = property?.imageUrl || [];

  // Reset image index if property changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  // Keyboard navigation for image slider
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
        description: "Property link copied to your clipboard!",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Back button skeleton */}
        <div className="h-5 w-36 bg-muted rounded-md" />

        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>

        {/* Gallery skeleton */}
        <div className="space-y-3">
          <div className="h-[360px] sm:h-[460px] bg-muted rounded-3xl w-full" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 w-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-28 bg-muted rounded-2xl" />
            <div className="h-40 bg-muted rounded-2xl" />
            <div className="h-32 bg-muted rounded-2xl" />
          </div>
          <div className="h-80 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (isError || !property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Property Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The property listing you are looking for may have been removed or is temporarily unavailable.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
          <Link
            href="/properties"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Back to All Properties
          </Link>
        </div>
      </div>
    );
  }

  const landlord = property.landlord;
  const landlordUser = landlord?.user;
  const landlordName = landlord?.name || landlordUser?.name || "Verified Landlord";
  const landlordAvatar = landlordUser?.imageUrl;
  const currentImage = images[activeImageIndex] || images[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Navigation Breadcrumb & Share */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Properties</span>
          </Link>

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
                <span>Share</span>
              </>
            )}
          </Button>
        </div>

        {/* Title, Address & Status Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={`text-xs font-semibold px-3 py-1 ${
                property.isAvailable
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {property.isAvailable ? "Available for Rent" : "Currently Booked"}
            </Badge>

            <Badge variant="outline" className="text-xs px-2.5 py-1 text-muted-foreground">
              <Building2 className="w-3 h-3 mr-1 text-primary" />
              {property.city}
            </Badge>

            {property.createdAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Listed on{" "}
                  {new Date(property.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>
              {property.address}, {property.city}
            </span>
          </div>
        </div>

        {/* Image Slider / Gallery Component (One After Another) */}
        <div className="space-y-3">
          <div className="relative h-[360px] sm:h-[480px] lg:h-[540px] w-full rounded-3xl overflow-hidden border bg-muted shadow-xs group">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={`${property.title} - Photo ${activeImageIndex + 1}`}
                fill
                priority
                className="object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Building2 className="w-12 h-12" />
                <p className="text-xs">No photos uploaded for this property</p>
              </div>
            )}

            {/* Overlaid Gradient for Top and Bottom Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

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

            {/* Previous Image Navigation Button */}
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

            {/* Next Image Navigation Button */}
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

            {/* Dot Indicators on Mobile */}
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

          {/* Thumbnail Strip underneath */}
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
            {/* Quick Highlights Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-card border shadow-xs">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Monthly Rent</p>
                <p className="text-xl sm:text-2xl font-extrabold text-primary">
                  ৳{property.rentPrice?.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">BDT per month</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Bedrooms / Rooms</p>
                <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-extrabold text-foreground">
                  <BedDouble className="w-5 h-5 text-primary" />
                  <span>{property.totalRooms}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Total rooms</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">City</p>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground capitalize">
                  {property.city}
                </p>
                <p className="text-[11px] text-muted-foreground">Location</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {property.isAvailable ? "Available" : "Booked"}
                </p>
                <p className="text-[11px] text-muted-foreground">Rental status</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                About This Property
              </h2>
              <div className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Amenities & Features
                  </h2>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {property.amenities.length} {property.amenities.length === 1 ? "Amenity" : "Amenities"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs sm:text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Rooms Section Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <DoorOpen className="w-5 h-5 text-primary" />
                    <span>Property Rooms</span>
                    {property.rooms && property.rooms.length > 0 && (
                      <Badge variant="secondary" className="text-xs ml-1 font-semibold">
                        {property.rooms.length} {property.rooms.length === 1 ? "Room" : "Rooms"}
                      </Badge>
                    )}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Explore available rooms, seat capacity, and individual monthly rates.
                  </p>
                </div>

                <Link
                  href={`/properties/rooms?propertyId=${property.id}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "h-9 px-4 text-xs font-semibold rounded-xl gap-1.5 shrink-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>View All Rooms</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Quick preview of existing rooms if present */}
              {property.rooms && property.rooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {property.rooms.slice(0, 4).map((room: any, idx: number) => (
                    <div
                      key={room.id || idx}
                      className="p-4 rounded-2xl border bg-muted/20 space-y-2 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">
                          Room {room.roomNumber || idx + 1}
                        </span>
                        <Badge
                          variant={room.status === "BOOKED" ? "secondary" : "default"}
                          className="text-[10px]"
                        >
                          {room.status || "AVAILABLE"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Capacity: {room.capacity || room.availableSeats || 1} persons
                      </p>
                      {room.rentAmount && (
                        <p className="text-sm font-bold text-primary">
                          ৳{room.rentAmount.toLocaleString()} / mo
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-muted/30 border border-dashed text-center space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Click "View All Rooms" to check all individual rooms and seat details for this property.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Sticky Landlord & Contact Card */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Booking / Rent Summary Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card border shadow-xs space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Rental Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-primary">
                    ৳{property.rentPrice?.toLocaleString()}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground"> / month</span>
                </div>
                <div className="pt-1">
                  <Badge
                    className={`text-xs px-2.5 py-0.5 ${
                      property.isAvailable
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {property.isAvailable ? "Ready for Immediate Move-in" : "Currently Occupied"}
                  </Badge>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/properties/rooms?propertyId=${property.id}`}
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "w-full h-10 text-xs font-semibold rounded-xl gap-2 shadow-xs justify-center flex items-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.01]"
                    )}
                  >
                    <DoorOpen className="w-4 h-4" />
                    <span>View Property Rooms</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
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
                      {landlord?.address || "Verified Landlord"}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px] text-primary border-primary/30">
                      Verified Owner
                    </Badge>
                  </div>
                </div>

                {/* Direct Action Contact Buttons */}
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
                      )}&su=${encodeURIComponent(`Inquiry for ${property.title}`)}`}
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
                  Verified property listing. Connect directly with the landlord with zero hidden middleman commissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Image Modal */}
      {isFullscreen && (
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-5xl p-4 bg-black/95 text-white border-none sm:rounded-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>
                  {property.title} - Photo {activeImageIndex + 1} of {images.length}
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
