"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Home, 
  Search 
} from "lucide-react";
import { useGetAllLandlord } from "@/hooks";
import { Landlord } from "@/types/landloard.type";

export default function AllLandlords() {
  // TanStack Query v5 ফিক্স: isPending কে isLoading হিসেবে ডিক্লেয়ার করা হয়েছে
  const { data, isPending: isLoading, isError } = useGetAllLandlord();
  const [searchTerm, setSearchTerm] = useState("");

  const landlords: Landlord[] = Array.isArray(data?.data) ? data.data : [];

  const filteredLandlords = landlords.filter((landlord) => {
    const term = searchTerm.toLowerCase();
    return (
      (landlord.name?.toLowerCase() || "").includes(term) ||
      (landlord.email?.toLowerCase() || "").includes(term) ||
      (landlord.address?.toLowerCase() || "").includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border rounded-2xl p-6 space-y-4 animate-pulse bg-card">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
              <div className="h-20 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <XCircle className="mx-auto h-12 w-12 text-destructive mb-3" />
        <h2 className="text-xl font-semibold">Failed to load landlords</h2>
        <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* হেডার ও সার্চ বার */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Landlord Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse registered landlords and their managed listings ({landlords.length} total)
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* এম্পটি স্টেট */}
      {filteredLandlords.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
          <h3 className="text-lg font-medium">No landlords found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try searching with a different term.</p>
        </div>
      ) : (
        /* ল্যান্ডলর্ড কার্ড গ্রিড */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLandlords.map((landlord) => (
            <div
              key={landlord.id}
              className="group border rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                {/* প্রোফাইল ও ভেরিফিকেশন স্ট্যাটাস */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center font-bold text-primary uppercase text-lg border">
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
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
                        {landlord.name || "Unnamed Landlord"}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        NID: {landlord.nidOrPassportNumber || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* স্ট্যাটাস ব্যাজ */}
                  {landlord.verificationStatus === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>

                {/* কন্টাক্ট ডিটেইলস */}
                <div className="mt-5 space-y-2 text-sm text-muted-foreground border-y py-3.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{landlord.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span>{landlord.contactNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{landlord.address || "N/A"}</span>
                  </div>
                </div>

                {/* প্রপার্টি প্রিভিউ সেকশন */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5" /> Listed Properties
                    </span>
                    <span className="bg-muted px-2 py-0.5 rounded-full font-semibold">
                      {landlord.properties?.length || 0}
                    </span>
                  </div>

                  {landlord.properties && landlord.properties.length > 0 ? (
                    <div className="space-y-2.5">
                      {landlord.properties.slice(0, 1).map((prop) => (
                        <div
                          key={prop.id}
                          className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-xl border"
                        >
                          {prop.imageUrl?.[0] ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={prop.imageUrl[0]}
                                alt={prop.title || "Property"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-medium truncate">{prop.title}</h4>
                            <p className="text-xs text-primary font-semibold mt-0.5">
                              ৳{prop.rentPrice ? prop.rentPrice.toLocaleString() : 0} / month
                            </p>
                          </div>
                        </div>
                      ))}
                      {landlord.properties.length > 1 && (
                        <p className="text-xs text-center text-muted-foreground pt-1">
                          +{landlord.properties.length - 1} more properties
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-center py-4 bg-muted/20 border border-dashed rounded-xl text-muted-foreground">
                      No properties listed yet
                    </div>
                  )}
                </div>
              </div>

              {/* কার্ড ফুটার বাটন */}
              <div className="p-4 bg-muted/20 border-t mt-2">
                <Link
                  href={`/landloard/${landlord.id}`}
                  className="flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View Details & Profile
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}