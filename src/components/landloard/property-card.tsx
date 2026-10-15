"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllProperty } from "@/hooks";
import { Property } from "@/types/property.type";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  BedDouble,
  Sparkles,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  ArrowUpDown,
  Home,
  ImageIcon,
  Calendar,
} from "lucide-react";

export default function PropertyCard() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const containerRef = useRef<HTMLDivElement>(null);
  const limit = 6;

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useGetAllProperty({
    searchTerm: searchTerm || undefined,
    page,
    limit,
    sortBy: "createdAt",
    sortOrder,
  });

  // Extract property list safely
  const properties: Property[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const meta = data?.data?.meta || {
    page: 1,
    limit,
    total: properties.length,
    totalPages: Math.max(1, Math.ceil(properties.length / limit)),
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    setPage(newPage);
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div ref={containerRef} className="w-full space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search properties by title, city, address, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-9 text-xs sm:text-sm h-11 bg-background rounded-xl"
          />
          {searchInput && (
            <button
              onClick={handleResetSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & Quick info */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="h-11 px-3.5 text-xs gap-2 rounded-xl"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
          </Button>

          <div className="text-xs text-muted-foreground font-medium hidden sm:block">
            {isLoading ? (
              <span>Loading properties...</span>
            ) : (
              <span>
                {meta.total} {meta.total === 1 ? "Property" : "Properties"} Found
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {isLoading ? (
        // Loading Skeleton Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-2xl overflow-hidden bg-card shadow-xs animate-pulse space-y-4"
            >
              <div className="h-52 bg-muted w-full" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="flex gap-2 pt-2">
                  <div className="h-5 bg-muted rounded-full w-14" />
                  <div className="h-5 bg-muted rounded-full w-14" />
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        // Error State
        <div className="border rounded-2xl p-12 text-center bg-card shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Failed to load properties
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There was an issue fetching the property listings. Please try again.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : properties.length === 0 ? (
        // Empty State
        <div className="border rounded-2xl p-12 text-center bg-card shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <Home className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {searchTerm ? "No matching properties found" : "No properties listed yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {searchTerm
                ? `We couldn't find any properties matching "${searchTerm}". Try checking for spelling or searching for another location.`
                : "There are currently no rental properties listed on the platform."}
            </p>
          </div>
          {searchTerm && (
            <Button variant="outline" size="sm" onClick={handleResetSearch}>
              Clear Search Filter
            </Button>
          )}
        </div>
      ) : (
        // Property Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const thumbnail = property.imageUrl?.[0];
            const landlordUser = property.landlord?.user;
            const landlordName =
              property.landlord?.name ||
              landlordUser?.name ||
              "Verified Landlord";
            const landlordAvatar = landlordUser?.imageUrl;

            return (
              <div
                key={property.id}
                className="group border rounded-2xl overflow-hidden bg-card shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                {/* Card Top: Image Area */}
                <div>
                  <Link
                    href={`/properties/${property.id}`}
                    className="block relative h-52 w-full bg-muted overflow-hidden cursor-pointer"
                  >
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges: Availability & Photo count */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <Badge
                        className={`text-[11px] font-semibold px-2.5 py-0.5 shadow-sm backdrop-blur-md ${
                          property.isAvailable
                            ? "bg-emerald-500/90 text-white"
                            : "bg-black/60 text-muted-foreground"
                        }`}
                      >
                        {property.isAvailable ? "Available" : "Booked"}
                      </Badge>

                      {property.imageUrl && property.imageUrl.length > 1 && (
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                          <ImageIcon className="w-3 h-3" />
                          {property.imageUrl.length} Photos
                        </span>
                      )}
                    </div>

                    {/* Bottom Rent Badge inside Image */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                        ৳{property.rentPrice?.toLocaleString()}
                        <span className="text-xs font-normal text-white/90">
                          {" "}
                          / month
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Card Middle: Content & Specs */}
                  <div className="p-5 space-y-3">
                    {/* Title */}
                    <Link href={`/properties/${property.id}`}>
                      <h3
                        className="font-bold text-base text-foreground line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                        title={property.title}
                      >
                        {property.title}
                      </h3>
                    </Link>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">
                        {property.address}, {property.city}
                      </span>
                    </div>

                    {/* Rooms Spec */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 text-xs text-foreground font-medium">
                        <BedDouble className="h-3.5 w-3.5 text-primary" />
                        <span>{property.totalRooms} Rooms</span>
                      </div>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Amenities Chips */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 bg-muted/50 font-normal border border-border/40"
                          >
                            <Sparkles className="w-2.5 h-2.5 mr-1 text-primary" />
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0.5 font-normal"
                          >
                            +{property.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Landlord Info & View Button */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t flex items-center justify-between gap-3">
                    {/* Landlord profile snippet */}
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-8 w-8 border shrink-0">
                        {landlordAvatar && <AvatarImage src={landlordAvatar} />}
                        <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                          {landlordName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold text-foreground truncate max-w-[110px]">
                            {landlordName}
                          </p>
                          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Landlord
                        </p>
                      </div>
                    </div>

                    {/* View Button */}
                    <Link
                      href={`/properties/${property.id}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "text-xs h-8 px-3.5 font-semibold rounded-lg gap-1.5 shadow-xs shrink-0 flex items-center"
                      )}
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="bg-card border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing Page{" "}
            <span className="font-semibold text-foreground">{meta.page}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {meta.totalPages}
            </span>{" "}
            (Total {meta.total} properties)
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => handlePageChange(meta.page - 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === meta.totalPages ||
                  (pageNumber >= meta.page - 1 && pageNumber <= meta.page + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === meta.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="h-8 w-8 text-xs p-0 font-medium"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                if (
                  pageNumber === meta.page - 2 ||
                  pageNumber === meta.page + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="text-xs px-1 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => handlePageChange(meta.page + 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
