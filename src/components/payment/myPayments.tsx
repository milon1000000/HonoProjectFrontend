"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyPayments, usePayBooking } from "@/hooks";
import { PaymentRecord } from "@/types/payment.type";
import { PaymentStatus } from "@/types/booking.type";
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
  Loader2,
} from "lucide-react";

export default function MyPayments() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query Hook
  const { data, isLoading, isError, refetch, isFetching } = useGetMyPayments({
    page,
    limit,
  });

  const { mutate: payBookingMutation, isPending: isPayPending } = usePayBooking();

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
        const propTitle = payment.booking?.property?.title?.toLowerCase() || "";
        const propCity = payment.booking?.property?.city?.toLowerCase() || "";
        const roomNo = payment.booking?.room?.roomNumber?.toLowerCase() || "";
        const bookingId = payment.bookingId?.toLowerCase() || "";

        const matches =
          trxId.includes(term) ||
          paymentId.includes(term) ||
          gateway.includes(term) ||
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
    let totalSpent = 0;

    paymentsList.forEach((p) => {
      if (p.status === "PAID") {
        paidCount++;
        totalSpent += Number(p.amount || 0);
      } else if (p.status === "UNPAID") {
        unpaidCount++;
      } else if (p.status === "REFUNDED") {
        refundedCount++;
      }
    });

    return {
      total: totalCount,
      paid: paidCount,
      unpaid: unpaidCount,
      refunded: refundedCount,
      spent: totalSpent,
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

  // Handle Pay Action for Unpaid items
  const handlePay = (bookingId: string) => {
    setPayingBookingId(bookingId);
    payBookingMutation(
      { bookingId },
      {
        onSuccess: (res: any) => {
          const paymentUrl = res?.data?.paymentUrl || res?.paymentUrl;
          if (paymentUrl) {
            toast.add({
              title: "Redirecting to bKash",
              description: "Please complete your payment securely...",
              type: "info",
            });
            window.location.href = paymentUrl;
          } else {
            toast.add({
              title: "Payment Initialized",
              description: res?.message || "Payment processed successfully.",
              type: "success",
            });
            refetch();
            setPayingBookingId(null);
          }
        },
        onError: (err: any) => {
          setPayingBookingId(null);
          toast.add({
            title: "Payment Error",
            description:
              err?.data?.message ||
              err?.message ||
              "Could not initiate payment. Please try again.",
            type: "error",
          });
        },
      }
    );
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

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Metrics / Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Transactions */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Total Invoices
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "..." : stats.total}
            </h3>
            <p className="text-xs text-muted-foreground">All transaction records</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spent / Paid */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Total Paid
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {isLoading ? "..." : `৳${stats.spent.toLocaleString()}`}
            </h3>
            <p className="text-xs text-muted-foreground">Successfully paid rent</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

        {/* Successful Payments */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Paid Invoices
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "..." : stats.paid}
            </h3>
            <p className="text-xs text-muted-foreground">Completed via bKash</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Unpaid Payments */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Pending / Unpaid
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
              {isLoading ? "..." : stats.unpaid}
            </h3>
            <p className="text-xs text-muted-foreground">Requires your payment</p>
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
              placeholder="Search by Transaction ID, Property, Room, Booking ID..."
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

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Status:
            </span>
            {(["ALL", "PAID", "UNPAID", "REFUNDED"] as const).map((st) => (
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
                {st === "ALL" ? "All Payments" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Payments Table Card */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        {/* Loading state */}
        {isLoading && (
          <div className="p-12 space-y-4">
            <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-base font-semibold">Loading your payment history...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">Failed to Load Payments</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Could not retrieve your payment records. Please try again.
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
            <h3 className="text-base font-bold text-foreground">No Payments Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchInput || statusFilter !== "ALL"
                ? "No payments match your current search and filter criteria."
                : "You have not made any room payments yet."}
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
                  <TableHead className="min-w-[160px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4 pl-5">
                    Transaction / ID
                  </TableHead>
                  <TableHead className="min-w-[240px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Property & Unit
                  </TableHead>
                  <TableHead className="min-w-[150px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Amount & Gateway
                  </TableHead>
                  <TableHead className="min-w-[130px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[160px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-4">
                    Move-in & Seats
                  </TableHead>
                  <TableHead className="w-[140px] text-right font-bold text-xs uppercase tracking-wider text-muted-foreground py-4 pr-5">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const booking = payment.booking;
                  const property = booking?.property;
                  const room = booking?.room;
                  const propertyImage = property?.imageUrl?.[0];

                  const createdDateFormatted = payment.createdAt
                    ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  const startDateFormatted = booking?.startDate
                    ? new Date(booking.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  const hasTrx = Boolean(payment.transactionId);
                  const isUnpaid = payment.status === "UNPAID";
                  const isPayingThis =
                    isPayPending && payingBookingId === payment.bookingId;

                  return (
                    <TableRow
                      key={payment.id}
                      className="hover:bg-muted/50 transition-colors group border-b"
                    >
                      {/* 1. Transaction ID & Payment Date */}
                      <TableCell className="pl-5 py-4 align-middle">
                        <div className="space-y-1">
                          {hasTrx ? (
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopy(payment.transactionId!, "Transaction ID", e)
                              }
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground bg-muted hover:bg-muted/80 px-2.5 py-0.5 rounded-md border transition-all"
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
                              onClick={(e) => handleCopy(payment.id, "Payment ID", e)}
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground bg-muted/60 hover:bg-muted px-2.5 py-0.5 rounded-md border transition-all"
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

                      {/* 2. Property & Room */}
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
                          <div className="space-y-1 min-w-0 max-w-[220px]">
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
                                  className="text-[11px] px-1.5 py-0 h-4 gap-0.5 font-semibold"
                                >
                                  <DoorOpen className="w-2.5 h-2.5" />
                                  Unit {room.roomNumber}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[11px] px-1.5 py-0 h-4 text-muted-foreground"
                                >
                                  Full Property
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Amount & Gateway */}
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

                      {/* 4. Payment Status */}
                      <TableCell className="py-4 align-middle">
                        {getPaymentStatusBadge(payment.status)}
                      </TableCell>

                      {/* 5. Move-in & Seats */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{startDateFormatted}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3 shrink-0" />
                            <span>
                              {booking?.seatCount || 1}{" "}
                              {(booking?.seatCount || 1) > 1 ? "Seats" : "Seat"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* 6. Action Column: "View" Button + "Pay Now" if Unpaid */}
                      <TableCell className="py-4 pr-5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          {isUnpaid && (
                            <Button
                              variant="default"
                              size="sm"
                              disabled={isPayingThis}
                              onClick={() => handlePay(payment.bookingId)}
                              className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                              title="Pay rent via bKash"
                            >
                              {isPayingThis ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CreditCard className="w-3 h-3" />
                              )}
                              <span>Pay</span>
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5 hover:bg-primary hover:text-primary-foreground border-border/80 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Button>
                        </div>
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
              of{" "}
              <span className="font-bold text-foreground">{totalCount}</span> payments
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

      {/* 4. Single Payment View Modal (Dialog) */}
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
                      <Receipt className="w-5 h-5 text-primary" />
                      <span>Payment Receipt</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedPayment.id, "Payment ID")}
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
                        ? new Date(selectedPayment.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </DialogDescription>
                  </div>
                  <div>{getPaymentStatusBadge(selectedPayment.status)}</div>
                </div>
              </DialogHeader>

              {/* Financial Highlight Banner */}
              <div className="p-5 rounded-2xl border bg-muted/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Paid Amount</p>
                  <p className="text-3xl font-black text-foreground">
                    ৳{Number(selectedPayment.amount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-base font-bold text-foreground">
                    {selectedPayment.gateway || "bKash Tokenized"}
                  </p>
                  <p className="text-xs text-muted-foreground">Secure Checkout</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Transaction ID (TrxID)</p>
                  {selectedPayment.transactionId ? (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <code className="text-xs font-mono font-bold bg-background px-2.5 py-1 rounded-md border truncate">
                        {selectedPayment.transactionId}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(selectedPayment.transactionId!, "Transaction ID")
                        }
                        className="p-1 hover:bg-muted rounded"
                        title="Copy TrxID"
                      >
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-rose-500 font-semibold pt-1">
                      Payment Not Completed Yet
                    </p>
                  )}
                </div>
              </div>

              {/* Property & Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* 1. Property Details Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Property Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Property Name</p>
                      <p className="font-bold text-foreground text-base">
                        {selectedPayment.booking?.property?.title || "Property Not Assigned"}
                      </p>
                    </div>
                    {selectedPayment.booking?.property?.address && (
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Full Address</p>
                        <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>
                            {selectedPayment.booking.property.address},{" "}
                            {selectedPayment.booking.property.city}
                          </span>
                        </p>
                      </div>
                    )}
                    {selectedPayment.booking?.room && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium">Room Unit</p>
                          <p className="font-bold text-foreground">
                            Unit {selectedPayment.booking.room.roomNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium">Monthly Rent</p>
                          <p className="font-bold text-foreground">
                            ৳{selectedPayment.booking.room.rentAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Booking & Rental Summary Card */}
                <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Booking Summary
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Move-in Date</p>
                      <p className="font-bold text-foreground">
                        {selectedPayment.booking?.startDate
                          ? new Date(selectedPayment.booking.startDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">Booked Seats</p>
                      <p className="font-semibold text-foreground">
                        {selectedPayment.booking?.seatCount || 1}{" "}
                        {(selectedPayment.booking?.seatCount || 1) > 1 ? "Seats" : "Seat"}
                      </p>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Booking ID</p>
                        <p className="font-mono text-xs text-foreground">
                          #{selectedPayment.bookingId?.slice(0, 8)}
                        </p>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {selectedPayment.booking?.status || "PENDING"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Gateway Details (if exists) */}
                {selectedPayment.paymentGatewayData && (
                  <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3 md:col-span-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Gateway Transaction Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {selectedPayment.paymentGatewayData.customerMsisdn && (
                        <div className="p-3 rounded-lg bg-muted/40 border">
                          <p className="text-muted-foreground text-[11px]">bKash Wallet Number</p>
                          <p className="font-mono font-bold text-foreground">
                            {selectedPayment.paymentGatewayData.customerMsisdn}
                          </p>
                        </div>
                      )}
                      {selectedPayment.paymentGatewayData.paymentID && (
                        <div className="p-3 rounded-lg bg-muted/40 border">
                          <p className="text-muted-foreground text-[11px]">Payment ID</p>
                          <p className="font-mono font-semibold truncate text-foreground">
                            {selectedPayment.paymentGatewayData.paymentID}
                          </p>
                        </div>
                      )}
                      {selectedPayment.paymentGatewayData.statusMessage && (
                        <div className="p-3 rounded-lg bg-muted/40 border">
                          <p className="text-muted-foreground text-[11px]">Status Message</p>
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
              <DialogFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {selectedPayment.status === "UNPAID" && (
                    <Button
                      variant="default"
                      size="sm"
                      disabled={isPayPending && payingBookingId === selectedPayment.bookingId}
                      onClick={() => handlePay(selectedPayment.bookingId)}
                      className="rounded-xl text-xs font-bold gap-1.5 px-5 bg-primary text-primary-foreground"
                    >
                      {isPayPending && payingBookingId === selectedPayment.bookingId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5" />
                      )}
                      <span>Pay Now via bKash</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayment(null)}
                    className="rounded-xl text-xs font-bold px-6"
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

