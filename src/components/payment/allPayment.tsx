"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllPayments } from "@/hooks";
import { PaymentRecord } from "@/types/payment.type";
import { PaymentStatus, BookingStatus } from "@/types/booking.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { cn } from "cn";
import {
  Search,
  RefreshCw,
  Eye,
  Copy,
  Check,
  Building2,
  DoorOpen,
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Banknote,
  RotateCcw,
  Receipt,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function AllPayments() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(
    null,
  );
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query Hook
  const { data, isLoading, isError, refetch, isFetching } = useGetAllPayments({
    page,
    limit,
  });

  // Extract data safely
  const rawData = data?.data;
  const paymentsList: PaymentRecord[] = useMemo(() => {
    if (Array.isArray(rawData?.data)) return rawData.data;
    if (Array.isArray(rawData)) return rawData;
    return [];
  }, [rawData]);

  const meta = rawData?.meta || (data as any)?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalCount = meta?.total ?? paymentsList.length;

  // Filter payments client-side for fast interactive search & status filter
  const filteredPayments = useMemo(() => {
    return paymentsList.filter((payment) => {
      // Status filter
      if (statusFilter !== "ALL") {
        if (payment.status !== statusFilter) return false;
      }

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const trxId = payment.transactionId?.toLowerCase() || "";
        const paymentId = payment.id?.toLowerCase() || "";
        const gateway = payment.gateway?.toLowerCase() || "";
        const tenantName = payment.booking?.tenant?.name?.toLowerCase() || "";
        const tenantEmail = payment.booking?.tenant?.email?.toLowerCase() || "";
        const propTitle = payment.booking?.property?.title?.toLowerCase() || "";
        const propCity = payment.booking?.property?.city?.toLowerCase() || "";
        const roomNo = payment.booking?.room?.roomNumber?.toLowerCase() || "";
        const bookingId = payment.bookingId?.toLowerCase() || "";

        const matches =
          trxId.includes(term) ||
          paymentId.includes(term) ||
          gateway.includes(term) ||
          tenantName.includes(term) ||
          tenantEmail.includes(term) ||
          propTitle.includes(term) ||
          propCity.includes(term) ||
          roomNo.includes(term) ||
          bookingId.includes(term);

        if (!matches) return false;
      }

      return true;
    });
  }, [paymentsList, searchTerm, statusFilter]);

  // Statistics counters
  const stats = useMemo(() => {
    let paidCount = 0;
    let unpaidCount = 0;
    let refundedCount = 0;
    let failedCount = 0;
    let totalRevenue = 0;

    paymentsList.forEach((p) => {
      if (p.status === "PAID") {
        paidCount++;
        totalRevenue += Number(p.amount || 0);
      } else if (p.status === "UNPAID") {
        unpaidCount++;
      } else if (p.status === "REFUNDED") {
        refundedCount++;
      } else if (p.status === "FAILED") {
        failedCount++;
      }
    });

    return {
      total: totalCount,
      paid: paidCount,
      unpaid: unpaidCount,
      refunded: refundedCount,
      failed: failedCount,
      revenue: totalRevenue,
    };
  }, [paymentsList, totalCount]);

  // Copy helper
  const handleCopy = (text: string, label: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.add({
      title: "Copied to Clipboard",
      description: `${label} copied.`,
      type: "info",
    });
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  // Payment status badge renderer
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            Paid
          </Badge>
        );
      case "UNPAID":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            Unpaid
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            Refunded
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Booking status badge
  const getBookingStatusBadge = (status?: BookingStatus) => {
    if (!status) return null;
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] px-2 py-0.5 font-medium rounded-md">
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] px-2 py-0.5 font-medium rounded-md">
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="text-[11px] px-2 py-0.5 text-muted-foreground rounded-md"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Metrics / Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Payments */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Total Transactions
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "..." : stats.total}
            </h3>
            <p className="text-xs text-muted-foreground">All payment records</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Total Paid Amount */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Collected Revenue
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {isLoading ? "..." : `৳${stats.revenue.toLocaleString()}`}
            </h3>
            <p className="text-xs text-muted-foreground">
              Confirmed paid funds
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

        {/* Completed / Successful Payments */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Successful Payments
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "..." : stats.paid}
            </h3>
            <p className="text-xs text-muted-foreground">
              Verified transactions
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Unpaid / Pending Payments */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Unpaid / Pending
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
              {isLoading ? "..." : stats.unpaid}
            </h3>
            <p className="text-xs text-muted-foreground">
              Awaiting tenant payment
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar: Search & Filters */}
      <div className="rounded-2xl border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Transaction ID, Payment ID, Tenant, Property, Gateway..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-9 h-11 rounded-xl text-sm bg-muted/40 focus:bg-background transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action buttons: Refresh & Reset */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-11 rounded-xl text-xs sm:text-sm font-semibold gap-2 px-4"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4",
                  isFetching && "animate-spin text-primary",
                )}
              />
              <span>Refresh</span>
            </Button>

            {(statusFilter !== "ALL" || searchInput) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-11 rounded-xl text-xs sm:text-sm text-muted-foreground hover:text-foreground font-semibold gap-2 px-4"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Payment Status:
            </span>
            {(["ALL", "PAID", "UNPAID", "REFUNDED", "FAILED"] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setPage(1);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all border",
                    statusFilter === st
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
                  )}
                >
                  {st === "ALL" ? "All Payments" : st}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Payments Table Card */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        {/* Loading state skeleton */}
        {isLoading && (
          <div className="p-12 space-y-4">
            <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-base font-semibold">
                Loading payments data...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Failed to Load Payments
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              An error occurred while fetching payment records. Please try
              again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl text-xs font-bold px-6"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredPayments.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Receipt className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No Payments Found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchInput || statusFilter !== "ALL"
                ? "No payments match your current search and filter criteria."
                : "No payment transactions have been recorded yet."}
            </p>
            {(searchInput || statusFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="rounded-xl text-xs font-bold gap-2 px-5"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Table Content */}
        {!isLoading && !isError && filteredPayments.length > 0 && (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-muted/40 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[150px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4 pl-5">
                    Transaction / ID
                  </TableHead>
                  <TableHead className="min-w-[200px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Tenant
                  </TableHead>
                  <TableHead className="min-w-[240px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Property & Unit
                  </TableHead>
                  <TableHead className="min-w-[150px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Amount & Method
                  </TableHead>
                  <TableHead className="min-w-[130px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[140px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Booking Ref
                  </TableHead>
                  <TableHead className="w-[110px] text-right font-bold text-xs uppercase tracking-wider text-muted-foreground py-4 pr-5">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const booking = payment.booking;
                  const property = booking?.property;
                  const room = booking?.room;
                  const tenant = booking?.tenant;
                  const propertyImage = property?.imageUrl?.[0];
                  const tenantInitial =
                    tenant?.name?.trim().charAt(0).toUpperCase() || "T";

                  const createdDateFormatted = payment.createdAt
                    ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  const hasTrx = Boolean(payment.transactionId);

                  return (
                    <TableRow
                      key={payment.id}
                      className="hover:bg-muted/50 transition-colors group border-b"
                    >
                      {/* 1. Transaction ID & Payment ID */}
                      <TableCell className="pl-5 py-4 align-middle">
                        <div className="space-y-1">
                          {hasTrx ? (
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopy(
                                  payment.transactionId!,
                                  "Transaction ID",
                                  e,
                                )
                              }
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded-md border transition-all"
                              title="Click to copy Transaction ID"
                            >
                              <span>{payment.transactionId}</span>
                              {copiedText === payment.transactionId ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3 text-muted-foreground opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopy(payment.id, "Payment ID", e)
                              }
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded-md border transition-all"
                              title="Click to copy Payment ID"
                            >
                              <span>#{payment.id.slice(0, 8)}</span>
                              {copiedText === payment.id ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3 text-muted-foreground opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {createdDateFormatted}
                          </p>
                        </div>
                      </TableCell>

                      {/* 2. Tenant Details */}
                      <TableCell className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 rounded-full border bg-primary/10 text-primary font-bold text-sm shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                              {tenantInitial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {tenant?.name || "Anonymous Tenant"}
                            </p>
                            {tenant?.email && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate font-mono">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{tenant.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Property & Room */}
                      <TableCell className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-muted border shrink-0">
                            {propertyImage ? (
                              <Image
                                src={propertyImage}
                                alt={property?.title || "Property"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Building2 className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 max-w-[200px]">
                            <p className="text-sm font-bold text-foreground truncate">
                              {property?.title || "Property Not Assigned"}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              {property?.city && (
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                                  <span className="truncate">
                                    {property.city}
                                  </span>
                                </span>
                              )}
                              {room && (
                                <Badge
                                  variant="secondary"
                                  className="text-[11px] px-1.5 py-0 h-4 gap-0.5 font-semibold"
                                >
                                  <DoorOpen className="w-2.5 h-2.5" />
                                  Unit {room.roomNumber}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* 4. Amount & Gateway */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground">
                            ৳{Number(payment.amount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            <span>{payment.gateway || "bKash"}</span>
                          </p>
                        </div>
                      </TableCell>

                      {/* 5. Payment Status */}
                      <TableCell className="py-4 align-middle">
                        {getPaymentStatusBadge(payment.status)}
                      </TableCell>

                      {/* 6. Booking Ref */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{payment.bookingId?.slice(0, 8)}
                          </span>
                          <div>{getBookingStatusBadge(booking?.status)}</div>
                        </div>
                      </TableCell>

                      {/* 7. Action Button */}
                      <TableCell className="py-4 pr-5 text-right align-middle">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(payment);
                          }}
                          className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 hover:bg-primary hover:text-primary-foreground border-border/80 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Toolbar */}
        {!isLoading && !isError && filteredPayments.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t bg-muted/20 text-xs sm:text-sm">
            <div className="text-muted-foreground font-medium">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredPayments.length}
              </span>{" "}
              of <span className="font-bold text-foreground">{totalCount}</span>{" "}
              transactions
              {meta && (
                <span className="ml-1.5 text-xs">
                  (Page {page} of {totalPages})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || isFetching}
                className="h-9 rounded-xl text-xs font-bold gap-1.5 px-3.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-muted border">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page >= totalPages || isFetching}
                className="h-9 rounded-xl text-xs font-bold gap-1.5 px-3.5"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Comprehensive & Spacious Payment Details Modal Dialog */}
      <Dialog
        open={Boolean(selectedPayment)}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
      >
        <DialogContent className="sm:max-w-3xl md:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
          {selectedPayment && (
            <div className="space-y-6">
              {/* Modal Header */}
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                  <div className="space-y-1">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                      <span>Transaction Details</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(selectedPayment.id, "Payment ID")
                        }
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-lg border transition-all"
                        title="Click to copy Payment ID"
                      >
                        <span>#{selectedPayment.id.slice(0, 8)}</span>
                        {copiedText === selectedPayment.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                      Processed on{" "}
                      {selectedPayment.createdAt
                        ? new Date(selectedPayment.createdAt).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )
                        : "N/A"}
                    </DialogDescription>
                  </div>
                  <div>{getPaymentStatusBadge(selectedPayment.status)}</div>
                </div>
              </DialogHeader>

              {/* Financial Highlight Banner */}
              <div className="p-5 rounded-2xl border bg-muted/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Transaction Amount
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    ৳{Number(selectedPayment.amount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Payment Gateway
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {selectedPayment.gateway || "bKash Tokenized"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Automated Checkout
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Transaction ID (TrxID)
                  </p>
                  {selectedPayment.transactionId ? (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <code className="text-xs font-mono font-bold bg-background px-2.5 py-1 rounded-md border truncate">
                        {selectedPayment.transactionId}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            selectedPayment.transactionId!,
                            "Transaction ID",
                          )
                        }
                        className="p-1 hover:bg-muted rounded"
                        title="Copy TrxID"
                      >
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic pt-1">
                      No TrxID generated
                    </p>
                  )}
                </div>
              </div>

              {/* Detail Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* 1. Tenant & Customer Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Tenant / Payer
                    Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Customer Name
                      </p>
                      <p className="font-bold text-foreground text-base">
                        {selectedPayment.booking?.tenant?.name ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Email Address
                      </p>
                      <p className="font-semibold text-foreground font-mono">
                        {selectedPayment.booking?.tenant?.email ||
                          "Not provided"}
                      </p>
                    </div>
                    {selectedPayment.paymentGatewayData?.customerMsisdn && (
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          bKash Account / MSISDN
                        </p>
                        <p className="font-semibold text-foreground font-mono">
                          {selectedPayment.paymentGatewayData.customerMsisdn}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Tenant ID
                      </p>
                      <p className="font-mono text-xs text-muted-foreground truncate">
                        {selectedPayment.booking?.tenantId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Associated Property & Booking Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Booking &
                    Property Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Property
                      </p>
                      <p className="font-bold text-foreground">
                        {selectedPayment.booking?.property?.title ||
                          "Property Not Assigned"}
                      </p>
                      {selectedPayment.booking?.property?.city && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {selectedPayment.booking.property.address},{" "}
                            {selectedPayment.booking.property.city}
                          </span>
                        </p>
                      )}
                    </div>
                    {selectedPayment.booking?.room && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium">
                            Room Unit
                          </p>
                          <p className="font-semibold text-foreground">
                            Unit {selectedPayment.booking.room.roomNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium">
                            Monthly Rent
                          </p>
                          <p className="font-semibold text-foreground">
                            ৳
                            {selectedPayment.booking.room.rentAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="pt-2 border-t flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          Booking ID
                        </p>
                        <p className="font-mono text-xs text-foreground">
                          #{selectedPayment.bookingId?.slice(0, 8)}
                        </p>
                      </div>
                      <div>
                        {getBookingStatusBadge(selectedPayment.booking?.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Gateway Details (if exists) */}
                {selectedPayment.paymentGatewayData && (
                  <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3 md:col-span-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Gateway
                      Metadata
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {selectedPayment.paymentGatewayData.paymentID && (
                        <div className="p-3 rounded-lg bg-muted/40 border">
                          <p className="text-muted-foreground text-[11px]">
                            Payment ID
                          </p>
                          <p className="font-mono font-semibold truncate text-foreground">
                            {selectedPayment.paymentGatewayData.paymentID}
                          </p>
                        </div>
                      )}
                      {selectedPayment.paymentGatewayData.trxID && (
                        <div className="p-3 rounded-lg bg-muted/40 border">
                          <p className="text-muted-foreground text-[11px]">
                            TrxID
                          </p>
                          <p className="font-mono font-semibold truncate text-foreground">
                            {selectedPayment.paymentGatewayData.trxID}
                          </p>
                        </div>
                      )}
                      {selectedPayment.paymentGatewayData.statusMessage && (
                        <div className="p-3 rounded-lg bg-muted/40 border">
                          <p className="text-muted-foreground text-[11px]">
                            Status Message
                          </p>
                          <p className="font-semibold text-foreground">
                            {selectedPayment.paymentGatewayData.statusMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <DialogFooter className="flex flex-row justify-between items-center pt-3 border-t">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-xl text-xs font-bold px-6 ml-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
