"use client";

import React from "react";
import Link from "next/link";
import { useGetLandlordAnalytics } from "@/hooks/analytics.hook";
import { LandlordAnalyticsData } from "@/types/analytics.type";
import { StatCard } from "./stat-card";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsSkeleton } from "./analytics-skeleton";
import { AnalyticsError } from "./analytics-error";
import {
  Building2,
  DoorOpen,
  CalendarCheck,
  Banknote,
  PlusCircle,
  TrendingDown,
  CheckCircle2,
  Clock,
  XCircle,
  AlertOctagon,
  ArrowRight,
  Home,
  ShieldCheck,
  BedDouble,
  DollarSign,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function LandlordAnalytic() {
  const { data, isPending, isError, refetch, isFetching } =
    useGetLandlordAnalytics();

  if (isPending) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <AnalyticsError
        message="Unable to fetch your landlord analytics. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const raw = data?.data;
  const stats: LandlordAnalyticsData = {
    totalProperties: raw?.totalProperties ?? 0,
    totalRooms: raw?.totalRooms ?? 0,
    availableRooms: raw?.availableRooms ?? 0,
    bookedRooms: raw?.bookedRooms ?? 0,
    totalBookings: raw?.totalBookings ?? 0,
    pendingBookings: raw?.pendingBookings ?? 0,
    approvedBookings: raw?.approvedBookings ?? 0,
    cancelledBookings: raw?.cancelledBookings ?? 0,
    rejectedBookings: raw?.rejectedBookings ?? 0,
    totalLandlordEarnings: raw?.totalLandlordEarnings ?? 0,
    totalLandlordRefunded: raw?.totalLandlordRefunded ?? 0,
  };

  const grossEarnings =
    stats.totalLandlordEarnings + stats.totalLandlordRefunded;
  const totalRoomsCount = stats.totalRooms || 1;
  const occupancyRate = stats.totalRooms
    ? Math.round((stats.bookedRooms / stats.totalRooms) * 100)
    : 0;

  const totalBookingsCount = stats.totalBookings || 1;

  const bookingRows = [
    {
      label: "Pending Inquiries",
      count: stats.pendingBookings,
      percentage: Math.round(
        (stats.pendingBookings / totalBookingsCount) * 100,
      ),
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      icon: Clock,
      urgent: stats.pendingBookings > 0,
    },
    {
      label: "Approved & Confirmed",
      count: stats.approvedBookings,
      percentage: Math.round(
        (stats.approvedBookings / totalBookingsCount) * 100,
      ),
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      icon: CheckCircle2,
      urgent: false,
    },
    {
      label: "Cancelled by Tenant",
      count: stats.cancelledBookings,
      percentage: Math.round(
        (stats.cancelledBookings / totalBookingsCount) * 100,
      ),
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      icon: XCircle,
      urgent: false,
    },
    {
      label: "Rejected Requests",
      count: stats.rejectedBookings,
      percentage: Math.round(
        (stats.rejectedBookings / totalBookingsCount) * 100,
      ),
      color: "bg-slate-400",
      textColor: "text-muted-foreground",
      bgColor: "bg-muted",
      icon: AlertOctagon,
      urgent: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnalyticsHeader
        badge={{
          icon: ShieldCheck,
          label: "Landlord Management Portal",
        }}
        title="Property & Revenue Insights"
        description="Monitor real-time occupancy, track tenant booking requests, and evaluate your rental properties' financial performance."
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        primaryAction={{
          label: "Create Property",
          href: "/landlord/create-property",
          icon: PlusCircle,
        }}
      />

      {/* Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Earnings"
          value={`৳ ${stats.totalLandlordEarnings.toLocaleString()}`}
          description={`Refunds deducted: ৳ ${stats.totalLandlordRefunded.toLocaleString()}`}
          icon={Banknote}
          color="emerald"
          badge={{
            text: "Net Revenue",
            variant: "emerald",
          }}
          subValue={`Gross revenue: ৳ ${grossEarnings.toLocaleString()}`}
        />

        <StatCard
          title="Listed Properties"
          value={stats.totalProperties}
          description="Active rental buildings listed"
          icon={Building2}
          color="blue"
          badge={{
            text: `${stats.totalProperties} Listed`,
            variant: "blue",
          }}
          subValue={`${stats.totalRooms} rooms managed`}
          href="/landlord/create-property"
        />

        <StatCard
          title="Room Occupancy"
          value={`${stats.bookedRooms} / ${stats.totalRooms}`}
          description={`${stats.availableRooms} rooms available for rent`}
          icon={DoorOpen}
          color="purple"
          badge={{
            text: `${occupancyRate}% Occupied`,
            variant: "purple",
          }}
          subValue={
            stats.totalRooms > 0
              ? `${stats.availableRooms} vacant rooms remaining`
              : "No rooms listed yet"
          }
          href="/landlord/create-property/rooms"
        />

        <StatCard
          title="Booking Requests"
          value={stats.totalBookings}
          description="Total tenant inquiries submitted"
          icon={CalendarCheck}
          color="amber"
          badge={{
            text:
              stats.pendingBookings > 0
                ? `${stats.pendingBookings} New`
                : "Clear",
            variant: stats.pendingBookings > 0 ? "amber" : "default",
          }}
          subValue={
            stats.pendingBookings > 0
              ? `${stats.pendingBookings} pending approvals`
              : "All requests resolved"
          }
        />
      </div>

      {/* Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Inventory & Occupancy Rate Card */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Room Inventory & Occupancy
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time occupancy status across all your properties
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                  {occupancyRate}%
                </span>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Occupancy Rate
                </p>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                {stats.totalRooms > 0 ? (
                  <>
                    <div
                      style={{
                        width: `${(stats.bookedRooms / stats.totalRooms) * 100}%`,
                      }}
                      className="bg-purple-600 transition-all duration-500"
                      title={`Booked: ${stats.bookedRooms}`}
                    />
                    <div
                      style={{
                        width: `${(stats.availableRooms / stats.totalRooms) * 100}%`,
                      }}
                      className="bg-emerald-500 transition-all duration-500"
                      title={`Available: ${stats.availableRooms}`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-muted" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="size-2 rounded-full bg-purple-600" />
                  Booked & Occupied ({stats.bookedRooms})
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Available for Rent ({stats.availableRooms})
                </span>
              </div>
            </div>

            {/* Room Breakdown Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-border/40 bg-purple-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    Occupied Rooms
                  </span>
                  <BedDouble className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-foreground mt-2">
                  {stats.bookedRooms}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Generating recurring rent
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/40 bg-emerald-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Available Rooms
                  </span>
                  <DoorOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-foreground mt-2">
                  {stats.availableRooms}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Ready for instant booking
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/40 bg-blue-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Total Rooms
                  </span>
                  <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-extrabold text-foreground mt-2">
                  {stats.totalRooms}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Across {stats.totalProperties} properties
                </p>
              </div>
            </div>

            {/* Inquiries breakdown */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Booking Inquiries Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {bookingRows.map((row) => {
                  const RowIcon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20 transition-colors",
                        row.urgent &&
                          "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "size-8 rounded-lg flex items-center justify-center shrink-0",
                            row.bgColor,
                            row.textColor,
                          )}
                        >
                          <RowIcon className="size-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            {row.label}
                            {row.urgent && (
                              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {stats.totalBookings > 0
                              ? `${row.percentage}% of requests`
                              : "0%"}
                          </div>
                        </div>
                      </div>
                      <span className="text-base font-extrabold text-foreground">
                        {row.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Want to list another room for an existing property?
            </span>
            <Link
              href="/landlord/create-property/rooms"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1 font-medium",
              )}
            >
              <span>Manage Rooms</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Financial Performance & Shortcuts */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Earnings Breakdown */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-base font-bold text-foreground">
                Revenue & Inflow
              </h2>
              <DollarSign className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-xs font-medium text-muted-foreground">
                  Gross Booking Volume
                </span>
                <span className="text-sm font-bold text-foreground">
                  ৳ {grossEarnings.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="size-3.5 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                    Total Refunded
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  ৳ {stats.totalLandlordRefunded.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Net Earnings
                </span>
                <span className="text-base font-extrabold text-foreground">
                  ৳ {stats.totalLandlordEarnings.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Earnings represent confirmed tenant payments deposited after
              completed stays and minus refunded cancellations.
            </p>

            <Link
              href="/landlord/create-property"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full justify-center gap-1 font-medium",
              )}
            >
              <PlusCircle className="size-3.5" />
              <span>Add Another Property</span>
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Landlord Shortcuts
            </span>
            <div className="space-y-2">
              <Link
                href="/landlord/create-property"
                className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium text-foreground"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="size-3.5 text-blue-500" />
                  Create New Property
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Home className="size-3.5 text-emerald-500" />
                  View Public Listings
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
