"use client";

import React from "react";
import Link from "next/link";
import { useGetTenantAnalytics } from "@/hooks/analytics.hook";
import { TenantAnalyticsData } from "@/types/analytics.type";
import { StatCard } from "./stat-card";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsSkeleton } from "./analytics-skeleton";
import { AnalyticsError } from "./analytics-error";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
  AlertOctagon,
  ArrowRight,
  Receipt,
  Home,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function TenantAnalytic() {
  const { data, isPending, isError, refetch, isFetching } =
    useGetTenantAnalytics();

  if (isPending) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <AnalyticsError
        message="Unable to fetch your tenant analytics. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const raw = data?.data;
  const stats: TenantAnalyticsData = {
    totalBookings: raw?.totalBookings ?? 0,
    pendingBookings: raw?.pendingBookings ?? 0,
    approvedBookings: raw?.approvedBookings ?? 0,
    cancelledBookings: raw?.cancelledBookings ?? 0,
    rejectedBookings: raw?.rejectedBookings ?? 0,
    totalAmountSpent: raw?.totalAmountSpent ?? 0,
    totalRefunded: raw?.totalRefunded ?? 0,
  };

  const netSpent = Math.max(0, stats.totalAmountSpent - stats.totalRefunded);
  const totalBookingsCount = stats.totalBookings || 1; // avoid division by zero
  const approvalRate = stats.totalBookings
    ? Math.round((stats.approvedBookings / stats.totalBookings) * 100)
    : 0;

  const statusRows = [
    {
      label: "Approved Bookings",
      count: stats.approvedBookings,
      percentage: Math.round((stats.approvedBookings / totalBookingsCount) * 100),
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      icon: CheckCircle2,
    },
    {
      label: "Pending Review",
      count: stats.pendingBookings,
      percentage: Math.round((stats.pendingBookings / totalBookingsCount) * 100),
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      icon: Clock,
    },
    {
      label: "Cancelled by You",
      count: stats.cancelledBookings,
      percentage: Math.round((stats.cancelledBookings / totalBookingsCount) * 100),
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      icon: XCircle,
    },
    {
      label: "Rejected by Landlord",
      count: stats.rejectedBookings,
      percentage: Math.round((stats.rejectedBookings / totalBookingsCount) * 100),
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
          label: "Tenant Analytics Portal",
        }}
        title="My Rental Overview"
        description="Monitor your rental booking history, approval statuses, and payments directly from your tenant dashboard."
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        primaryAction={{
          label: "Browse Rooms",
          href: "/",
          icon: Home,
        }}
      />

      {/* Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="All-time booking requests"
          icon={Calendar}
          color="blue"
          badge={{
            text: `${stats.totalBookings} Total`,
            variant: "blue",
          }}
          subValue="Lifetime reservation records"
          href="/user/my-booking"
        />

        <StatCard
          title="Approved"
          value={stats.approvedBookings}
          description="Confirmed reservations"
          icon={CheckCircle2}
          color="emerald"
          badge={{
            text: stats.approvedBookings > 0 ? "Active" : "None",
            variant: stats.approvedBookings > 0 ? "emerald" : "default",
          }}
          subValue={
            stats.totalBookings > 0
              ? `${approvalRate}% confirmation rate`
              : "No bookings yet"
          }
          href="/user/my-booking"
        />

        <StatCard
          title="Pending Approval"
          value={stats.pendingBookings}
          description="Waiting for landlord response"
          icon={Clock}
          color="amber"
          badge={{
            text: stats.pendingBookings > 0 ? "In Review" : "Clear",
            variant: stats.pendingBookings > 0 ? "amber" : "default",
          }}
          subValue={
            stats.pendingBookings > 0
              ? "Landlord will review soon"
              : "No pending requests"
          }
          href="/user/my-booking"
        />

        <StatCard
          title="Total Amount Spent"
          value={`৳ ${stats.totalAmountSpent.toLocaleString()}`}
          description={`Refunded: ৳ ${stats.totalRefunded.toLocaleString()}`}
          icon={CreditCard}
          color="purple"
          badge={{
            text: "bKash Paid",
            variant: "purple",
          }}
          subValue={`Net Spent: ৳ ${netSpent.toLocaleString()}`}
          href="/user/my-payments"
        />
      </div>

      {/* Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Progress */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Booking Status Breakdown
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detailed distribution of all your room reservation attempts
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-foreground">
                  {approvalRate}%
                </span>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Approval Rate
                </p>
              </div>
            </div>

            {/* Distribution Stacked Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                {stats.totalBookings > 0 ? (
                  <>
                    <div
                      style={{
                        width: `${(stats.approvedBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-emerald-500 transition-all duration-500"
                      title={`Approved: ${stats.approvedBookings}`}
                    />
                    <div
                      style={{
                        width: `${(stats.pendingBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-amber-500 transition-all duration-500"
                      title={`Pending: ${stats.pendingBookings}`}
                    />
                    <div
                      style={{
                        width: `${(stats.cancelledBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-rose-500 transition-all duration-500"
                      title={`Cancelled: ${stats.cancelledBookings}`}
                    />
                    <div
                      style={{
                        width: `${(stats.rejectedBookings / stats.totalBookings) * 100}%`,
                      }}
                      className="bg-slate-400 transition-all duration-500"
                      title={`Rejected: ${stats.rejectedBookings}`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-muted" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Approved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Pending
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" />
                  Cancelled
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-slate-400" />
                  Rejected
                </span>
              </div>
            </div>

            {/* Status Item Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {statusRows.map((row) => {
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
                            ? `${row.percentage}% of total`
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

          <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Need to check booking details or cancel a pending request?
            </span>
            <Link
              href="/user/my-booking"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1 font-medium"
              )}
            >
              <span>Manage Bookings</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Financial Overview & Quick Links */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Financial Summary Card */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-base font-bold text-foreground">
                Payment Summary
              </h2>
              <Receipt className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Gross Amount Paid
                </span>
                <span className="text-sm font-bold text-foreground">
                  ৳ {stats.totalAmountSpent.toLocaleString()}
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
                  ৳ {stats.totalRefunded.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Net Rental Spent
                </span>
                <span className="text-base font-extrabold text-foreground">
                  ৳ {netSpent.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Payments are recorded automatically upon completed bKash transactions.
              Refunds for cancelled bookings are credited back to your account.
            </p>

            <Link
              href="/user/my-payments"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-center gap-1 font-medium"
              )}
            >
              <span>View Payment Receipts</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Quick Shortcuts
            </span>
            <div className="space-y-2">
              <Link
                href="/user/my-booking"
                className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-blue-500" />
                  My Booking History
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Link>

              <Link
                href="/"
                className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Home className="size-3.5 text-emerald-500" />
                  Browse Rental Properties
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
