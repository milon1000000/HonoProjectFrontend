"use client";

import React from "react";
import Link from "next/link";
import { useGetAdminAnalytics } from "@/hooks/analytics.hook";
import { AdminAnalyticsData } from "@/types/analytics.type";
import { StatCard } from "./stat-card";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsSkeleton } from "./analytics-skeleton";
import { AnalyticsError } from "./analytics-error";
import {
  TrendingUp,
  Calendar,
  UserCheck,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  UserPlus,
  DoorOpen,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function AdminAnalytic() {
  const { data, isPending, isError, refetch, isFetching } =
    useGetAdminAnalytics();

  if (isPending) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <AnalyticsError
        message="Unable to fetch system admin analytics. Please check your credentials and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const raw = data?.data;
  const stats: AdminAnalyticsData = {
    totalLandlords: raw?.totalLandlords ?? 0,
    totalPendingLandlordApplication: raw?.totalPendingLandlordApplication ?? 0,
    totalApprovedLandlords: raw?.totalApprovedLandlords ?? 0,
    totalRejectedLandlords: raw?.totalRejectedLandlords ?? 0,
    totalTenants: raw?.totalTenants ?? 0,
    totalProperties: raw?.totalProperties ?? 0,
    totalRooms: raw?.totalRooms ?? 0,
    totalBookings: raw?.totalBookings ?? 0,
    totalPendingBookings: raw?.totalPendingBookings ?? 0,
    totalApprovedBookings: raw?.totalApprovedBookings ?? 0,
    totalCancelledBookings: raw?.totalCancelledBookings ?? 0,
    totalRejectedBookings: raw?.totalRejectedBookings ?? 0,
    totalRevenue: raw?.totalRevenue ?? 0,
    totalRefunded: raw?.totalRefunded ?? 0,
  };

  const totalBookingsCount = stats.totalBookings || 1;
  const bookingApprovalRate = stats.totalBookings
    ? Math.round(
        (stats.totalApprovedBookings / stats.totalBookings) * 100
      )
    : 0;

  const avgRoomsPerProperty = stats.totalProperties
    ? (stats.totalRooms / stats.totalProperties).toFixed(1)
    : "0";

  const bookingRows = [
    {
      label: "Approved Bookings",
      count: stats.totalApprovedBookings,
      percentage: Math.round(
        (stats.totalApprovedBookings / totalBookingsCount) * 100
      ),
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      icon: CheckCircle2,
    },
    {
      label: "Pending Bookings",
      count: stats.totalPendingBookings,
      percentage: Math.round(
        (stats.totalPendingBookings / totalBookingsCount) * 100
      ),
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      icon: Clock,
    },
    {
      label: "Cancelled Bookings",
      count: stats.totalCancelledBookings,
      percentage: Math.round(
        (stats.totalCancelledBookings / totalBookingsCount) * 100
      ),
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      icon: XCircle,
    },
    {
      label: "Rejected Bookings",
      count: stats.totalRejectedBookings,
      percentage: Math.round(
        (stats.totalRejectedBookings / totalBookingsCount) * 100
      ),
      color: "bg-slate-400",
      textColor: "text-muted-foreground",
      bgColor: "bg-muted",
      icon: AlertOctagon,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnalyticsHeader
        badge={{
          icon: ShieldCheck,
          label: "Master Administrator Portal",
        }}
        title="Platform Analytics & Overview"
        description="Comprehensive metrics across user registrations, landlord verification queues, property listings, and platform revenue."
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        primaryAction={{
          label: "Review Landlords",
          href: "/admin/landloard",
          icon: UserCheck,
        }}
      />

      {/* Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Platform Revenue"
          value={`৳ ${stats.totalRevenue.toLocaleString()}`}
          description={`Refunded: ৳ ${stats.totalRefunded.toLocaleString()}`}
          icon={TrendingUp}
          color="emerald"
          badge={{
            text: "Net Revenue",
            variant: "emerald",
          }}
          subValue={`Gross: ৳ ${(stats.totalRevenue + stats.totalRefunded).toLocaleString()}`}
          href="/admin/all-payments"
        />

        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="Platform-wide booking volume"
          icon={Calendar}
          color="blue"
          badge={{
            text: `${stats.totalApprovedBookings} Approved`,
            variant: "blue",
          }}
          subValue={`${bookingApprovalRate}% platform conversion`}
          href="/admin/all-booking"
        />

        <StatCard
          title="Registered Landlords"
          value={stats.totalLandlords}
          description={`${stats.totalApprovedLandlords} active verified partners`}
          icon={UserCheck}
          color="purple"
          badge={{
            text:
              stats.totalPendingLandlordApplication > 0
                ? `${stats.totalPendingLandlordApplication} Pending`
                : "All Approved",
            variant:
              stats.totalPendingLandlordApplication > 0 ? "amber" : "purple",
          }}
          subValue={
            stats.totalPendingLandlordApplication > 0
              ? "New applications awaiting approval"
              : "No pending applications"
          }
          href="/admin/landloard"
        />

        <StatCard
          title="Registered Tenants"
          value={stats.totalTenants}
          description="Active tenant platform users"
          icon={Users}
          color="amber"
          badge={{
            text: `${stats.totalTenants} Users`,
            variant: "amber",
          }}
          subValue="Registered tenant community"
        />
      </div>

      {/* Pending Application Alert Banner */}
      {stats.totalPendingLandlordApplication > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-foreground">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {stats.totalPendingLandlordApplication} Landlord Application
                {stats.totalPendingLandlordApplication > 1 ? "s" : ""} Pending Review
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                New landlords have submitted their NID and credentials for verification.
              </p>
            </div>
          </div>
          <Link
            href="/admin/landloard"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amber-600 hover:bg-amber-700 text-white shrink-0 self-start sm:self-center font-medium"
            )}
          >
            Review Applications
          </Link>
        </div>
      )}

      {/* Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Distribution & Status */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Platform Booking Flow
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time status of all booking transactions across properties
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-foreground">
                  {bookingApprovalRate}%
                </span>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Overall Approval Rate
                </p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                {stats.totalBookings > 0 ? (
                  <>
                    <div
                      style={{
                        width: `${(stats.totalApprovedBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-emerald-500 transition-all duration-500"
                      title={`Approved: ${stats.totalApprovedBookings}`}
                    />
                    <div
                      style={{
                        width: `${(stats.totalPendingBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-amber-500 transition-all duration-500"
                      title={`Pending: ${stats.totalPendingBookings}`}
                    />
                    <div
                      style={{
                        width: `${(stats.totalCancelledBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-rose-500 transition-all duration-500"
                      title={`Cancelled: ${stats.totalCancelledBookings}`}
                    />
                    <div
                      style={{
                        width: `${(stats.totalRejectedBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-slate-400 transition-all duration-500"
                      title={`Rejected: ${stats.totalRejectedBookings}`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-muted" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Approved ({stats.totalApprovedBookings})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Pending ({stats.totalPendingBookings})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" />
                  Cancelled ({stats.totalCancelledBookings})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-slate-400" />
                  Rejected ({stats.totalRejectedBookings})
                </span>
              </div>
            </div>

            {/* Status Item Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {bookingRows.map((row) => {
                const RowIcon = row.icon;
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "size-8 rounded-lg flex items-center justify-center shrink-0",
                          row.bgColor,
                          row.textColor
                        )}
                      >
                        <RowIcon className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          {row.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {stats.totalBookings > 0
                            ? `${row.percentage}% of platform bookings`
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

            {/* Inventory Ecosystem Sub-card */}
            <div className="pt-4 border-t border-border/40">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-3">
                Housing & Room Ecosystem
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-border/40 bg-card">
                  <span className="text-[11px] text-muted-foreground">
                    Total Properties
                  </span>
                  <div className="text-xl font-extrabold text-foreground mt-1">
                    {stats.totalProperties}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border/40 bg-card">
                  <span className="text-[11px] text-muted-foreground">
                    Total Rooms
                  </span>
                  <div className="text-xl font-extrabold text-foreground mt-1">
                    {stats.totalRooms}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border/40 bg-card">
                  <span className="text-[11px] text-muted-foreground">
                    Avg. Rooms / Property
                  </span>
                  <div className="text-xl font-extrabold text-foreground mt-1">
                    {avgRoomsPerProperty}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Review full booking logs and audit tenant confirmations
            </span>
            <Link
              href="/admin/all-booking"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1 font-medium"
              )}
            >
              <span>View All Bookings</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Landlords, Financials, and Shortcuts */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Landlord Application Breakdown */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-base font-bold text-foreground">
                Landlord Onboarding
              </h2>
              <UserCheck className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Pending Verification
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  {stats.totalPendingLandlordApplication}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Approved Landlords
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  {stats.totalApprovedLandlords}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                  Rejected Applications
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  {stats.totalRejectedLandlords}
                </span>
              </div>
            </div>

            <Link
              href="/admin/landloard"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full justify-center gap-1 font-medium"
              )}
            >
              <span>Manage Landlords</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-base font-bold text-foreground">
                Revenue & Payments
              </h2>
              <Receipt className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Net Platform Revenue
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  ৳ {stats.totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                  Total Refunds Disbursed
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  ৳ {stats.totalRefunded.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/admin/all-payments"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-center gap-1 font-medium"
              )}
            >
              <span>All Payment Logs</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

