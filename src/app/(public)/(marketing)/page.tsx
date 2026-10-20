"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetAllRooms } from "@/hooks/room.hook";
import { Room } from "@/types/room.type";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import {
  Building2,
  DoorOpen,
  Search,
  MapPin,
  ShieldCheck,
  CreditCard,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BedDouble,
  UserCheck,
  Check,
  Home,
  PhoneCall,
  Mail,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const adminEmail = "milonmondolmd33@gmail.com";

  // Fetch available rooms from the real API
  const { data: roomsData, isLoading: isRoomsLoading } = useGetAllRooms({
    limit: 6,
    status: "AVAILABLE",
  });

  const rooms: Room[] = Array.isArray(roomsData?.data)
    ? roomsData.data
    : Array.isArray((roomsData as any)?.data?.data)
      ? (roomsData as any).data.data
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/all-rooms?searchTerm=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      router.push("/all-rooms");
    }
  };

  const categories = [
    {
      title: "Single Private Rooms",
      desc: "Private quiet rooms with attached or shared bath",
      icon: DoorOpen,
      href: "/all-rooms",
      badge: "Private",
    },
    {
      title: "Shared / Hostel Beds",
      desc: "Economical seats for students and job holders",
      icon: Users,
      href: "/all-rooms",
      badge: "Shared",
    },
    {
      title: "Full Family Apartments",
      desc: "Multi-room residential properties and flats",
      icon: Building2,
      href: "/properties",
      badge: "Apartment",
    },
    {
      title: "Studio & Sublet Units",
      desc: "Compact units with independent or semi-private access",
      icon: Home,
      href: "/all-rooms",
      badge: "Studio",
    },
  ];

  const valueProps = [
    {
      title: "NID-Verified Landlords",
      desc: "Every property owner submits National ID credentials and ownership documentation before listing.",
      icon: ShieldCheck,
    },
    {
      title: "Seamless bKash Checkout",
      desc: "Pay your booking deposit or rent in seconds through Bangladesh's official bKash payment gateway.",
      icon: CreditCard,
    },
    {
      title: "Zero Broker Harassment",
      desc: "Connect directly with landlords without paying hefty commissions to unwanted middlemen or brokers.",
      icon: UserCheck,
    },
    {
      title: "Instant Move-in Confirmation",
      desc: "Get digital booking confirmation, landlord phone numbers, and move-in coordination right after payment.",
      icon: CheckCircle2,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Browse & Compare",
      desc: "Search verified rooms and apartments by location, monthly budget, amenities, and available seats.",
      icon: Search,
    },
    {
      step: "02",
      title: "Reserve via bKash",
      desc: "Confirm your room reservation online with protected bKash payments and get an official receipt.",
      icon: CreditCard,
    },
    {
      step: "03",
      title: "Inspect & Move In",
      desc: "Coordinate directly with the verified landlord, collect your keys, and settle into your new room.",
      icon: DoorOpen,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border/60 bg-gradient-to-b from-primary/10 via-muted/20 to-background">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/25 shadow-xs">
              <Sparkles className="size-3.5" />
              <span>Rental Housing & Room Reservation Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
              Find Your Ideal Room &{" "}
              <span className="text-primary bg-clip-text">Rental Home</span> Without the Broker Hassle
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified landlords. Explore clean private and
              shared rooms, pay securely via bKash, and move in with peace of mind.
            </p>

            {/* Search Widget */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 max-w-2xl mx-auto p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-lg flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative w-full flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by city, property name, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 pr-4 rounded-xl sm:rounded-2xl border-none shadow-none text-xs sm:text-sm bg-transparent focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 rounded-xl sm:rounded-2xl font-bold gap-2 cursor-pointer shrink-0"
              >
                <Search className="size-4" />
                <span>Search Rooms</span>
              </Button>
            </form>

            {/* Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="size-4 text-emerald-500" />
                Verified Landlords
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="size-4 text-emerald-500" />
                bKash Online Payment
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="size-4 text-emerald-500" />
                Zero Brokerage Commission
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Building2 className="size-3.5" />
              <span>Rental Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Explore Living Spaces
            </h2>
          </div>
          <Link
            href="/all-rooms"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1 font-semibold rounded-xl self-start sm:self-auto"
            )}
          >
            <span>View All Categories</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Browse Category</span>
                  <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Available Rooms (Live API Feed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <DoorOpen className="size-3.5" />
              <span>Available Rooms</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Current Room Listings
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Live rental rooms listed by verified landlords. Click to view
              details and reserve.
            </p>
          </div>
          <Link
            href="/all-rooms"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1 font-semibold rounded-xl self-start sm:self-auto"
            )}
          >
            <span>All Rooms Catalog</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {isRoomsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border/40 bg-card p-4 space-y-3 animate-pulse"
              >
                <div className="h-48 w-full bg-muted rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
                <div className="h-9 w-full bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-3xl border border-border/60 bg-muted/20 p-12 text-center space-y-3">
            <DoorOpen className="size-8 mx-auto text-muted-foreground" />
            <h3 className="text-base font-bold text-foreground">
              No rooms currently published
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Landlords are updating their room catalogs. Browse all properties
              or apply as a landlord to list your rooms.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Link
                href="/properties"
                className={cn(buttonVariants({ size: "sm" }), "rounded-xl")}
              >
                Browse Properties
              </Link>
              <Link
                href="/landloard-apply"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-xl"
                )}
              >
                Apply as Landlord
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 6).map((room) => {
              const property = room.property;
              const propertyImage =
                property?.imageUrl && property.imageUrl.length > 0
                  ? property.imageUrl[0]
                  : null;

              return (
                <div
                  key={room.id}
                  className="group rounded-3xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Thumbnail Image */}
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                      {propertyImage ? (
                        <Image
                          src={propertyImage}
                          alt={property?.title || `Room ${room.roomNumber}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-primary/40 bg-gradient-to-br from-primary/10 to-muted">
                          <DoorOpen className="size-12" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                          Available
                        </span>
                        {property?.city && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {property.city}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg font-bold">
                        Room {room.roomNumber}
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="px-5 space-y-2">
                      <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {property?.title || `Room ${room.roomNumber}`}
                      </h3>

                      {property?.address && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <MapPin className="size-3 shrink-0 text-primary" />
                          <span>{property.address}</span>
                        </p>
                      )}

                      {/* Capacity & Price */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <BedDouble className="size-3.5 text-primary" />
                          <span>
                            {room.capacity
                              ? `${room.capacity} Person Capacity`
                              : "Standard Room"}
                          </span>
                        </div>

                        <div>
                          <span className="text-base font-extrabold text-foreground">
                            ৳ {room.rentAmount?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            /mo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-4 border-t border-border/40 mt-4">
                    <Link
                      href={`/room/${room.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-full rounded-xl font-bold justify-center gap-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors cursor-pointer"
                      )}
                    >
                      <span>View & Book Room</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="border-y border-border/60 bg-muted/20 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How HousingManagement Works
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A transparent digital booking workflow from search to move-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative rounded-3xl border border-border/60 bg-card p-8 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-2xl font-black text-muted-foreground/30">
                      {st.step}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-foreground">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Platform Benefits
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why Use HousingManagement
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Designed to solve the challenges of urban rental living.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((vp) => {
            const Icon = vp.icon;
            return (
              <div
                key={vp.title}
                className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 shadow-xs"
              >
                <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-extrabold text-base text-foreground">
                  {vp.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {vp.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Landlord Onboarding CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-muted/30 p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              <Building2 className="size-3.5" />
              <span>For Property Owners & Landlords</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Have Vacant Rooms or Apartments? List on HousingManagement.
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              List your properties on HousingManagement. Reach prospective
              tenants, manage room availability, and collect rental payments with
              full transparency.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/landloard-apply"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-2xl font-bold gap-2 cursor-pointer"
                )}
              >
                <ShieldCheck className="size-4" />
                <span>Apply as a Verified Landlord</span>
              </Link>

              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-2xl font-bold cursor-pointer"
                )}
              >
                <span>Contact Administration</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-card via-muted/30 to-background p-8 sm:p-14 text-center space-y-6 shadow-xs">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Ready to Find Your Next Rental Space?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Browse through active rooms and properties or reach out directly to
            the platform administrator.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/all-rooms"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-2xl font-bold gap-2 cursor-pointer"
              )}
            >
              <DoorOpen className="size-4" />
              <span>Explore All Rooms</span>
            </Link>

            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-2xl font-bold gap-2 cursor-pointer"
              )}
            >
              <Mail className="size-4" />
              <span>Contact {adminEmail}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
