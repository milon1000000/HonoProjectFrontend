"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Home,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  BedDouble,
  ExternalLink,
  PlusCircle,
  BadgeCheck,
  UserCheck,
} from "lucide-react";
import { useGetSingleLandlord } from "@/hooks";
import { Landlord, Property } from "@/types/landloard.type";

interface SingleLandlordProps {
  id: string;
}

const formatDate = (date?: string | Date | null) => {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

export default function SingleLandlord({ id }: SingleLandlordProps) {
  const { data, isPending: isLoading, isError } = useGetSingleLandlord(id);

  const landlord: Landlord | undefined = data?.data;

  // লোডিং স্কেলিটন
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-6xl animate-pulse space-y-8">
        <div className="h-6 w-32 bg-muted rounded-md" />
        <div className="border rounded-3xl p-8 bg-card space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-muted" />
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="h-6 bg-muted rounded w-1/3 mx-auto sm:mx-0" />
              <div className="h-4 bg-muted rounded w-1/4 mx-auto sm:mx-0" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="h-10 bg-muted rounded-xl" />
            <div className="h-10 bg-muted rounded-xl" />
            <div className="h-10 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // এরর স্টেট
  if (isError || !landlord) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <XCircle className="mx-auto h-12 w-12 text-destructive mb-3" />
        <h2 className="text-xl font-bold">Landlord Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          The requested landlord profile could not be found or has been removed.
        </p>
        <Link
          href="/landloard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary border rounded-xl px-4 py-2 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Landlords
        </Link>
      </div>
    );
  }

  const properties: Property[] = landlord.properties || [];

  return (
    <div className="container mx-auto px-4 max-w-6xl space-y-8">
      {/* ব্যাক নেভিগেশন */}
      <Link
        href="/landloard"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Landlords
      </Link>

      {/* ল্যান্ডলর্ড প্রোফাইল হেডার কার্ড */}
      <div className="border rounded-3xl p-6 sm:p-8 bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center font-bold text-primary uppercase text-3xl border shadow-inner shrink-0">
              {landlord.user?.imageUrl ? (
                <Image
                  src={landlord.user.imageUrl}
                  alt={landlord.name || "Landlord"}
                  fill
                  className="object-cover"
                />
              ) : (
                landlord.name?.charAt(0) || "L"
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight capitalize">
                  {landlord.name}
                </h1>

                {/* ভেরিফিকেশন স্ট্যাটাস */}
                {landlord.verificationStatus === "APPROVED" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Landlord
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60">
                    <Clock className="w-3.5 h-3.5" /> Verification Pending
                  </span>
                )}

                {/* অ্যাকাউন্ট সক্রিয়তা ব্যাজ */}
                {landlord.user?.status === "ACTIVE" && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60">
                    <UserCheck className="w-3 h-3" /> Active Account
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                Landlord ID:{" "}
                <span className="font-mono text-xs">{landlord.id}</span>
              </p>
            </div>
          </div>

          {/* মেটা ইনফরমেশন ও অডিট হিস্ট্রি */}
          <div className="flex flex-col sm:items-end gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground/70" />
              Member since {formatDate(landlord.createdAt)}
            </div>

            <div className="flex items-center gap-1.5 font-medium text-foreground/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              NID/Passport:{" "}
              <span className="font-mono">{landlord.nidOrPassportNumber}</span>
            </div>

            {/* রিভিউ হিস্ট্রি (optional field) */}
            {landlord.reviewedAt ? (
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                Reviewed on {formatDate(landlord.reviewedAt)}
              </div>
            ) : null}
          </div>
        </div>

        {/* ইনফরমেশন গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border">
            <div className="p-2.5 rounded-xl bg-background border text-primary shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground block">
                Email Address
              </span>
              <span className="text-sm font-medium truncate block">
                {landlord.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border">
            <div className="p-2.5 rounded-xl bg-background border text-primary shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground block">
                Contact Number
              </span>
              <span className="text-sm font-medium truncate block">
                {landlord.contactNumber || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/40 border">
            <div className="p-2.5 rounded-xl bg-background border text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground block">
                Location / Address
              </span>
              <span className="text-sm font-medium truncate block">
                {landlord.address || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* প্রপার্টিজ সেকশন */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" /> Managed Properties
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              All rental listings owned and managed by this landlord (
              {properties.length})
            </p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed rounded-3xl bg-card/50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No properties listed yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
              This landlord currently has no active rental properties published
              on the platform.
            </p>
            <Link
              href="/properties/create"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group border rounded-3xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* ইমেজ থাম্বনেইল */}
                  <div className="relative h-56 w-full bg-muted overflow-hidden">
                    {property.imageUrl?.[0] ? (
                      <Image
                        src={property.imageUrl[0]}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Building2 className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      ৳{property.rentPrice.toLocaleString()} / month
                    </div>
                    {property.isAvailable ? (
                      <div className="absolute top-3 left-3 bg-emerald-600/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-medium">
                        Available
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-destructive/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-medium">
                        Rented
                      </div>
                    )}
                  </div>

                  {/* বিস্তারিত */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {property.address}, {property.city}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-foreground/80 pt-2 border-t">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="h-4 w-4 text-primary" />
                        {property.totalRooms} Rooms
                      </div>
                    </div>

                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {property.amenities.map((item, index) => (
                          <span
                            key={index}
                            className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted/20 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Photos: {property.imageUrl?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}