"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllRooms } from "@/hooks";
import { Room } from "@/types/room.type";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  ArrowUpDown,
  DoorOpen,
  Users,
  Banknote,
  Sparkles,
  AlertCircle,
  Hash,
  Home,
  CheckCircle2,
} from "lucide-react";

export default function AllRooms() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "rentAmount">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const limit = 8;

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1); // Reset to page 1 on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useGetAllRooms({
    searchTerm: searchTerm || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  // Extract rooms list safely from various API response shapes
  const rawRooms = data?.data;
  const rooms: Room[] = Array.isArray(rawRooms)
    ? rawRooms
    : Array.isArray(rawRooms?.data)
    ? rawRooms.data
    : [];

  const meta = data?.meta || data?.data?.meta || {
    page: 1,
    limit,
    total: rooms.length,
    totalPages: Math.max(1, Math.ceil(rooms.length / limit)),
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    setPage(newPage);
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStatusFilter("ALL");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) || statusFilter !== "ALL" || sortBy !== "createdAt" || sortOrder !== "desc";

  return (
    <div ref={containerRef} className="w-full space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by room unit, property title, city, or address..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-9 text-xs sm:text-sm h-11 bg-background rounded-xl"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="inline-flex rounded-xl border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                statusFilter === "ALL"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("AVAILABLE");
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                statusFilter === "AVAILABLE"
                  ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("BOOKED");
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                statusFilter === "BOOKED"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Booked
            </button>
          </div>

          {/* Sort By Rent / Date */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (sortBy === "createdAt") {
                setSortBy("rentAmount");
                setSortOrder("asc");
              } else if (sortBy === "rentAmount" && sortOrder === "asc") {
                setSortOrder("desc");
              } else {
                setSortBy("createdAt");
                setSortOrder("desc");
              }
              setPage(1);
            }}
            className="h-10 text-xs px-3 font-semibold rounded-xl gap-2 bg-background hover:bg-muted/50"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {sortBy === "createdAt"
                ? "Newest First"
                : sortOrder === "asc"
                ? "Rent: Low to High"
                : "Rent: High to Low"}
            </span>
          </Button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-10 text-xs px-3 font-medium text-muted-foreground hover:text-foreground gap-1.5 rounded-xl"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Stats & Search Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
            {meta.total} {meta.total === 1 ? "Room" : "Rooms"} Total
          </Badge>
          {searchTerm && (
            <span>
              Matching &ldquo;<span className="text-foreground font-semibold">{searchTerm}</span>&rdquo;
            </span>
          )}
        </div>

        {meta.totalPages > 1 && (
          <div>
            Page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
            <span className="font-semibold text-foreground">{meta.totalPages}</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border bg-card p-4 space-y-4 animate-pulse shadow-xs"
            >
              <div className="h-44 bg-muted rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 bg-muted rounded-xl" />
                <div className="h-12 bg-muted rounded-xl" />
              </div>
              <div className="h-9 bg-muted rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-3xl border bg-destructive/5 p-10 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Failed to Load Rooms</h3>
            <p className="text-xs text-muted-foreground">
              An error occurred while fetching the rooms. Please check your connection and try again.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl text-xs font-semibold px-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && rooms.length === 0 && (
        <div className="rounded-3xl border bg-card p-12 sm:p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <DoorOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No Rooms Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {hasActiveFilters
                ? "No rental rooms match your current search or filter criteria. Try adjusting your query."
                : "There are currently no rooms listed in the system."}
            </p>
          </div>
          {hasActiveFilters && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="rounded-xl text-xs font-semibold"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Room Cards Grid */}
      {!isLoading && !isError && rooms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const property = room.property;
            const propertyImage = property?.imageUrl?.[0];
            const isAvailable =
              room.status === "AVAILABLE" ||
              !room.status ||
              room.status === "available";

            const totalCapacity = room.capacity || 1;
            const availableSeatsCount =
              room.availableSeats !== undefined
                ? room.availableSeats
                : isAvailable
                ? 1
                : 0;

            const landlord = property?.landlord;

            return (
              <div
                key={room.id}
                className="group rounded-3xl border bg-card overflow-hidden shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges Container */}
                <div className="relative">
                  <Link
                    href={`/room/${room.id}`}
                    className="block relative h-48 sm:h-52 w-full overflow-hidden bg-muted"
                  >
                    {propertyImage ? (
                      <Image
                        src={propertyImage}
                        alt={`Room ${room.roomNumber} - ${property?.title || "Property"}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 bg-gradient-to-br from-primary/5 via-muted to-muted/80">
                        <DoorOpen className="w-10 h-10 text-primary/40" />
                        <span className="text-[11px] font-medium">Room Unit {room.roomNumber}</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  </Link>

                  {/* Availability Badge (Top-Left) */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 shadow-sm backdrop-blur-md",
                        isAvailable
                          ? "bg-emerald-500/90 text-white border-transparent"
                          : "bg-black/60 text-white/90 border-transparent"
                      )}
                    >
                      {isAvailable ? "Available" : "Booked"}
                    </Badge>
                  </div>

                  {/* Rent Price Pill (Top-Right) */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-extrabold shadow-sm flex items-center gap-1">
                    <span className="text-primary font-bold">৳</span>
                    <span>{room.rentAmount?.toLocaleString()}</span>
                    <span className="text-[10px] text-white/70 font-normal">/mo</span>
                  </div>

                  {/* Room Number Badge (Bottom-Left) */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-sm">
                    <DoorOpen className="w-3.5 h-3.5 text-primary" />
                    <span>Room {room.roomNumber}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Property Info & Title */}
                  <div className="space-y-1.5">
                    <Link
                      href={`/room/${room.id}`}
                      className="group-hover:text-primary transition-colors block"
                    >
                      <h3 className="font-extrabold text-base text-foreground tracking-tight line-clamp-1">
                        Room {room.roomNumber}
                        {property?.title ? ` - ${property.title}` : ""}
                      </h3>
                    </Link>

                    {/* Location */}
                    {property && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {property.city ? `${property.city}, ` : ""}
                          {property.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Room Specifications Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">Capacity</p>
                        <p className="text-xs font-bold text-foreground truncate">
                          {totalCapacity} {totalCapacity === 1 ? "Bed" : "Beds"}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">Vacant</p>
                        <p
                          className={cn(
                            "text-xs font-bold truncate",
                            availableSeatsCount > 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {availableSeatsCount} Seats
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Landlord & Property Link */}
                  {landlord && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-6 w-6 text-[10px]">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {(landlord.name || "L").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate font-medium">
                          {landlord.name || "Verified Landlord"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-primary shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="font-semibold">Verified</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button: View Room (Navigates to Single Room with ID) */}
                  <div className="pt-2">
                    <Link
                      href={`/room/${room.id}`}
                      className={cn(
                        buttonVariants({ variant: "default", size: "sm" }),
                        "w-full text-xs h-10 font-bold rounded-xl gap-2 shadow-xs justify-center flex items-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all group-hover:scale-[1.01]"
                      )}
                    >
                      <DoorOpen className="w-4 h-4" />
                      <span>View Room</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && !isError && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Showing Page <span className="font-bold text-foreground">{meta.page}</span> of{" "}
            <span className="font-bold text-foreground">{meta.totalPages}</span> ({meta.total} rooms)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="text-xs h-9 px-3 gap-1.5 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === meta.totalPages ||
                    Math.abs(p - meta.page) <= 1
                  );
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="px-1 text-xs text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={meta.page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "w-9 h-9 p-0 text-xs font-semibold rounded-xl",
                          meta.page === p
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "hover:bg-muted"
                        )}
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="text-xs h-9 px-3 gap-1.5 rounded-xl"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
