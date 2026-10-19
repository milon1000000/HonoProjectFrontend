"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllBookings } from "@/hooks";
import { Booking, BookingStatus, PaymentStatus } from "@/types/booking.type";
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
  Sparkles,
} from "lucide-react";

export default function AllBooking() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query Hook
  const { data, isLoading, isError, refetch, isFetching } = useGetAllBookings({
    page,
    limit,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  // Extract data safely
  const rawData = data?.data;
  const bookingsList: Booking[] = useMemo(() => {
    if (Array.isArray(rawData?.data)) return rawData.data;
    if (Array.isArray(rawData)) return rawData;
    return [];
  }, [rawData]);

  const meta = rawData?.meta || (data as any)?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalCount = meta?.total ?? bookingsList.length;

  // Filter bookings client-side for fast interactive search & payment filter
  const filteredBookings = useMemo(() => {
    return bookingsList.filter((booking) => {
      // Payment filter
      if (paymentFilter !== "ALL") {
        const paymentStatus = booking.payment?.status || "UNPAID";
        if (paymentStatus !== paymentFilter) return false;
      }

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const tenantName = booking.tenant?.name?.toLowerCase() || "";
        const tenantEmail = booking.tenant?.email?.toLowerCase() || "";
        const tenantPhone = booking.tenant?.contactNumber?.toLowerCase() || "";
        const propTitle = booking.property?.title?.toLowerCase() || "";
        const propCity = booking.property?.city?.toLowerCase() || "";
        const roomNo = booking.room?.roomNumber?.toLowerCase() || "";
        const bookingId = booking.id?.toLowerCase() || "";
        const trxId = booking.payment?.transactionId?.toLowerCase() || "";

        const matches =
          tenantName.includes(term) ||
          tenantEmail.includes(term) ||
          tenantPhone.includes(term) ||
          propTitle.includes(term) ||
          propCity.includes(term) ||
          roomNo.includes(term) ||
          bookingId.includes(term) ||
          trxId.includes(term);

        if (!matches) return false;
      }

      return true;
    });
  }, [bookingsList, searchTerm, paymentFilter]);

  // Statistics counters
  const stats = useMemo(() => {
    let pendingCount = 0;
    let approvedCount = 0;
    let totalRevenue = 0;
    let cancelledCount = 0;

    bookingsList.forEach((b) => {
      if (b.status === "PENDING") pendingCount++;
      if (b.status === "APPROVED") approvedCount++;
      if (b.status === "CANCELLED" || b.status === "REJECTED") cancelledCount++;
      if (b.payment?.status === "PAID" || b.status === "APPROVED") {
        totalRevenue += Number(b.totalAmount || 0);
      }
    });

    return {
      total: totalCount,
      pending: pendingCount,
      approved: approvedCount,
      cancelled: cancelledCount,
      revenue: totalRevenue,
    };
  }, [bookingsList, totalCount]);

  // Copy ID helper
  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.add({
      title: "ID Copied",
      description: `ID #${id.slice(0, 8)} copied to clipboard.`,
      type: "info",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  // Status badge renderer
  const getBookingStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-muted text-muted-foreground border border-border px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            Cancelled
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 font-semibold gap-1.5 text-xs rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Payment badge renderer
  const getPaymentStatusBadge = (payment?: Booking["payment"]) => {
    const status = payment?.status || "UNPAID";
    switch (status) {
      case "PAID":
        return (
          <div className="flex flex-col items-start gap-1">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 font-semibold gap-1 rounded-lg">
              <Check className="w-3 h-3 shrink-0" />
              Paid
            </Badge>
            {payment?.gateway && (
              <span className="text-[11px] text-muted-foreground font-mono">
                via {payment.gateway}
              </span>
            )}
          </div>
        );
      case "UNPAID":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs px-2.5 py-0.5 font-semibold gap-1 rounded-lg">
            <Clock className="w-3 h-3 shrink-0" />
            Unpaid
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs px-2.5 py-0.5 font-semibold gap-1 rounded-lg">
            <RotateCcw className="w-3 h-3 shrink-0" />
            Refunded
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/20 text-xs px-2.5 py-0.5 font-semibold gap-1 rounded-lg">
            <XCircle className="w-3 h-3 shrink-0" />
            Failed
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
        {/* Total Bookings */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Total Bookings</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "..." : stats.total}
            </h3>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Pending Review</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
              {isLoading ? "..." : stats.pending}
            </h3>
            <p className="text-xs text-muted-foreground">Awaiting payment / confirmation</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Bookings */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Approved Bookings</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {isLoading ? "..." : stats.approved}
            </h3>
            <p className="text-xs text-muted-foreground">Confirmed and active</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Collected Revenue */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Paid Amount</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "..." : `৳${stats.revenue.toLocaleString()}`}
            </h3>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
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
              placeholder="Search by tenant name, email, phone, property, room, booking ID..."
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
                className={cn("w-4 h-4", isFetching && "animate-spin text-primary")}
              />
              <span>Refresh</span>
            </Button>

            {(statusFilter !== "ALL" || paymentFilter !== "ALL" || searchInput) && (
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
              <SlidersHorizontal className="w-3.5 h-3.5" /> Status:
            </span>
            {(["ALL", "PENDING", "APPROVED", "CANCELLED", "REJECTED"] as const).map(
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
                      : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                  )}
                >
                  {st === "ALL" ? "All Status" : st}
                </button>
              )
            )}
          </div>

          {/* Payment Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Payment:
            </span>
            {(["ALL", "PAID", "UNPAID", "REFUNDED"] as const).map((pst) => (
              <button
                key={pst}
                type="button"
                onClick={() => setPaymentFilter(pst)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all border",
                  paymentFilter === pst
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                )}
              >
                {pst === "ALL" ? "All Payment" : pst}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Bookings Table Card */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        {/* Loading state skeleton */}
        {isLoading && (
          <div className="p-12 space-y-4">
            <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-base font-semibold">Loading bookings data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">Failed to Load Bookings</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              An error occurred while fetching bookings from server. Please try again.
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
        {!isLoading && !isError && filteredBookings.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Bookings Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchInput || statusFilter !== "ALL" || paymentFilter !== "ALL"
                ? "No bookings match your current search and filter criteria."
                : "No booking requests have been recorded yet."}
            </p>
            {(searchInput || statusFilter !== "ALL" || paymentFilter !== "ALL") && (
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
        {!isLoading && !isError && filteredBookings.length > 0 && (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-muted/40 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[130px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4 pl-5">
                    Booking ID
                  </TableHead>
                  <TableHead className="min-w-[220px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Tenant Details
                  </TableHead>
                  <TableHead className="min-w-[260px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Property & Unit
                  </TableHead>
                  <TableHead className="min-w-[150px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Move-in & Seats
                  </TableHead>
                  <TableHead className="min-w-[160px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Amount & Payment
                  </TableHead>
                  <TableHead className="min-w-[140px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Status
                  </TableHead>
                  <TableHead className="w-[110px] text-right font-bold text-xs uppercase tracking-wider text-muted-foreground py-4 pr-5">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const property = booking.property;
                  const room = booking.room;
                  const tenant = booking.tenant;
                  const payment = booking.payment;

                  const propertyImage = property?.imageUrl?.[0];
                  const tenantInitial =
                    tenant?.name?.trim().charAt(0).toUpperCase() || "T";

                  const startDateFormatted = booking.startDate
                    ? new Date(booking.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Not specified";

                  const createdDateFormatted = booking.createdAt
                    ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <TableRow
                      key={booking.id}
                      className="hover:bg-muted/50 transition-colors group border-b"
                    >
                      {/* 1. ID & Created Date */}
                      <TableCell className="pl-5 py-4 align-middle">
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleCopyId(booking.id, e)}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-md border transition-all"
                            title="Click to copy full ID"
                          >
                            <span>#{booking.id.slice(0, 8)}</span>
                            {copiedId === booking.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-60 group-hover:opacity-100" />
                            )}
                          </button>
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
                            {tenant?.contactNumber && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                <span>{tenant.contactNumber}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Property & Room */}
                      <TableCell className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border shrink-0">
                            {propertyImage ? (
                              <Image
                                src={propertyImage}
                                alt={property?.title || "Property"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Building2 className="w-6 h-6" />
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
                                  <span className="truncate">{property.city}</span>
                                </span>
                              )}
                              {room ? (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5 gap-1 font-semibold"
                                >
                                  <DoorOpen className="w-3 h-3" />
                                  Unit {room.roomNumber}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 text-muted-foreground"
                                >
                                  Full Property
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* 4. Move-in & Seats */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <span>{startDateFormatted}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {booking.seatCount}{" "}
                              {booking.seatCount > 1 ? "Seats" : "Seat"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* 5. Amount & Payment Status */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-1.5">
                          <p className="text-sm font-bold text-foreground">
                            ৳{Number(booking.totalAmount || 0).toLocaleString()}
                          </p>
                          <div>{getPaymentStatusBadge(payment)}</div>
                        </div>
                      </TableCell>

                      {/* 6. Booking Status */}
                      <TableCell className="py-4 align-middle">
                        {getBookingStatusBadge(booking.status)}
                      </TableCell>

                      {/* 7. Action Button */}
                      <TableCell className="py-4 pr-5 text-right align-middle">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
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
        {!isLoading && !isError && filteredBookings.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t bg-muted/20 text-xs sm:text-sm">
            <div className="text-muted-foreground font-medium">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">{totalCount}</span> bookings
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
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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

      {/* 4. Comprehensive & Spacious Booking Details Modal Dialog */}
      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-3xl md:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
          {selectedBooking && (
            <div className="space-y-6">
              {/* Modal Header */}
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                  <div className="space-y-1">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                      <span>Booking Details</span>
                      <button
                        type="button"
                        onClick={() => handleCopyId(selectedBooking.id)}
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-lg border transition-all"
                        title="Click to copy full ID"
                      >
                        <span>#{selectedBooking.id.slice(0, 8)}</span>
                        {copiedId === selectedBooking.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                      Created on{" "}
                      {selectedBooking.createdAt
                        ? new Date(selectedBooking.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {getBookingStatusBadge(selectedBooking.status)}
                    {getPaymentStatusBadge(selectedBooking.payment)}
                  </div>
                </div>
              </DialogHeader>

              {/* Highlight Property Showcase Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border bg-muted/30">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted border shrink-0">
                  {selectedBooking.property?.imageUrl?.[0] ? (
                    <Image
                      src={selectedBooking.property.imageUrl[0]}
                      alt={selectedBooking.property.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {selectedBooking.property?.title || "Property Not Assigned"}
                    </h3>
                    {selectedBooking.room && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-2.5 py-0.5 rounded-lg">
                        Unit {selectedBooking.room.roomNumber}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>
                      {selectedBooking.property?.address},{" "}
                      {selectedBooking.property?.city}
                    </span>
                  </p>
                </div>
              </div>

              {/* Modal Detail Cards Grid (2-Columns on tablet & desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* 1. Tenant Information Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Tenant Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Full Name</p>
                      <p className="font-bold text-foreground text-base">
                        {selectedBooking.tenant?.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Email Address</p>
                      <p className="font-semibold text-foreground font-mono">
                        {selectedBooking.tenant?.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Contact Number</p>
                      <p className="font-semibold text-foreground">
                        {selectedBooking.tenant?.contactNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Tenant Address</p>
                      <p className="font-medium text-foreground">
                        {selectedBooking.tenant?.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Room & Property Specs Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-primary" /> Room Specifications
                  </h4>
                  {selectedBooking.room ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Room Unit</p>
                        <p className="font-bold text-foreground text-base">
                          Unit {selectedBooking.room.roomNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Monthly Rent</p>
                        <p className="font-bold text-foreground text-base">
                          ৳{selectedBooking.room.rentAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Capacity</p>
                        <p className="font-semibold text-foreground">
                          {selectedBooking.room.capacity} Person(s)
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Available Seats</p>
                        <p className="font-semibold text-foreground">
                          {selectedBooking.room.availableSeats} Remaining
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">Booking Type</p>
                      <p className="font-bold text-foreground">
                        Entire Property Booking
                      </p>
                    </div>
                  )}

                  {/* Move-in & Seats booked */}
                  <div className="pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Move-in Date</p>
                      <p className="font-semibold text-foreground">
                        {selectedBooking.startDate
                          ? new Date(selectedBooking.startDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Booked Seats</p>
                      <p className="font-semibold text-foreground">
                        {selectedBooking.seatCount}{" "}
                        {selectedBooking.seatCount > 1 ? "Seats" : "Seat"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Payment & Financial Summary Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4 md:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">Total Rent Amount</p>
                      <p className="text-2xl font-black text-foreground">
                        ৳{Number(selectedBooking.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">Payment Method</p>
                      <p className="text-base font-bold text-foreground">
                        {selectedBooking.payment?.gateway || "bKash Tokenized"}
                      </p>
                      <div>{getPaymentStatusBadge(selectedBooking.payment)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">Transaction ID</p>
                      {selectedBooking.payment?.transactionId ? (
                        <div className="flex items-center gap-1.5 pt-1">
                          <code className="text-xs font-mono font-bold bg-background px-2 py-1 rounded border truncate">
                            {selectedBooking.payment.transactionId}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyId(selectedBooking.payment?.transactionId || "")
                            }
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic pt-1">
                          No transaction ID recorded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <DialogFooter className="flex flex-row justify-between items-center pt-3 border-t">
                {selectedBooking.propertyId && (
                  <Link
                    href={`/all-property/${selectedBooking.propertyId}`}
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-xl text-xs font-bold gap-2 px-4"
                    )}
                  >
                    <span>View Property Page</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
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
