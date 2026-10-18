"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyBookings, usePayBooking, useCancelBooking, useGetMe } from "@/hooks";
import { Booking, BookingStatus, PaymentStatus } from "@/types/booking.type";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  CreditCard,
  DoorOpen,
  MapPin,
  Building2,
  Users,
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Hash,
} from "lucide-react";

export default function BookingCard() {
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const currentUser = userData?.data;
  const isLoggedIn = Boolean(currentUser);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const { data, isLoading, isError, refetch } = useGetMyBookings(
    statusFilter === "ALL" ? undefined : { status: statusFilter }
  );

  const { mutate: payBookingMutation, isPending: isPayPending } = usePayBooking();
  const { mutate: cancelBookingMutation, isPending: isCancelPending } = useCancelBooking();

  // Extract bookings safely
  const rawData = data?.data;
  const bookings: Booking[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  // Pay booking handler (calls bKash payment endpoint)
  const handlePay = (booking: Booking) => {
    setPayingBookingId(booking.id);

    payBookingMutation(
      { bookingId: booking.id },
      {
        onSuccess: (res: any) => {
          const paymentUrl = res?.data?.paymentUrl || res?.paymentUrl;
          if (paymentUrl) {
            toast.add({
              title: "Redirecting to Payment",
              description: "Please complete your payment securely via bKash...",
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
            title: "Payment Failed",
            description:
              err?.data?.message ||
              err?.message ||
              "Could not initiate bKash payment. Please try again.",
            type: "error",
          });
        },
      }
    );
  };

  // Cancel booking handler
  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;

    cancelBookingMutation(
      { bookingId: cancellingBooking.id },
      {
        onSuccess: (res: any) => {
          toast.add({
            title: "Booking Cancelled",
            description: res?.message || "Your booking has been cancelled.",
            type: "success",
          });
          setCancellingBooking(null);
          refetch();
        },
        onError: (err: any) => {
          toast.add({
            title: "Cancellation Failed",
            description:
              err?.data?.message ||
              err?.message ||
              "Could not cancel booking. Please try again.",
            type: "error",
          });
        },
      }
    );
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 gap-1">
            <Clock className="w-3 h-3" />
            Pending Payment
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="text-xs px-2.5 py-0.5 gap-1 text-muted-foreground">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/20 text-xs px-2.5 py-0.5 gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status?: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] px-2.5 py-0.5">
            Paid (bKash)
          </Badge>
        );
      case "UNPAID":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] px-2.5 py-0.5">
            Unpaid
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/20 text-[11px] px-2.5 py-0.5">
            Payment Failed
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] px-2.5 py-0.5">
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  // Not logged in state
  if (!isUserLoading && !isLoggedIn) {
    return (
      <div className="rounded-3xl border bg-card p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <DoorOpen className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">Login Required</h2>
          <p className="text-xs text-muted-foreground">
            Please log in with your tenant account to view and manage your room bookings.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login?redirect=/user/my-booking"
            className={cn(buttonVariants({ size: "sm" }), "rounded-xl font-bold px-6")}
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Filter and Actions Toolbar */}
      <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="inline-flex rounded-xl border bg-muted/40 p-1 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0",
              statusFilter === "ALL"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Bookings
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PENDING")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0",
              statusFilter === "PENDING"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pending
          </button>
          
          <button
            type="button"
            onClick={() => setStatusFilter("CANCELLED")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0",
              statusFilter === "CANCELLED"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Cancelled
          </button>
        </div>

        {/* Refresh & Quick Links */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl text-xs h-9 px-3 gap-1.5 hover:bg-muted"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            <span>Refresh</span>
          </Button>

          <Link
            href="/all-rooms"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-xl text-xs h-9 px-4 font-semibold gap-1.5"
            )}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Book New Room</span>
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl border bg-card p-6 space-y-4 animate-pulse shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 bg-muted rounded w-32" />
                <div className="h-5 bg-muted rounded w-20" />
              </div>
              <div className="flex gap-4">
                <div className="h-24 w-28 bg-muted rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-muted rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-3xl border bg-destructive/5 p-10 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Failed to Load Bookings</h3>
            <p className="text-xs text-muted-foreground">
              An error occurred while fetching your bookings. Please try again.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl text-xs font-semibold px-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && bookings.length === 0 && (
        <div className="rounded-3xl border bg-card p-12 sm:p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No Bookings Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {statusFilter === "ALL"
                ? "You haven't made any room booking requests yet. Explore our verified rooms and book your ideal stay!"
                : `No bookings found with status "${statusFilter}".`}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/all-rooms"
              className={cn(buttonVariants({ size: "sm" }), "rounded-xl text-xs font-bold px-5")}
            >
              Browse Available Rooms
            </Link>
          </div>
        </div>
      )}

      {/* Bookings Card Grid */}
      {!isLoading && !isError && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const property = booking.property;
            const room = booking.room;
            const payment = booking.payment;

            const isPendingPayment =
              booking.status === "PENDING" && payment?.status !== "PAID";

            const isPaid = payment?.status === "PAID" || booking.status === "APPROVED";
            const isCancelling = isCancelPending && cancellingBooking?.id === booking.id;
            const isPaying = isPayPending && payingBookingId === booking.id;

            const propertyImage = property?.imageUrl?.[0];
            const startDateFormatted = booking.startDate
              ? new Date(booking.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Not Specified";

            const createdDateFormatted = booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";

            return (
              <div
                key={booking.id}
                className="group rounded-3xl border bg-card p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                {/* Header: ID, Booking Date, and Badges */}
                <div className="flex items-center justify-between gap-2 border-b pb-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      <span className="font-mono font-medium">
                        ID: {booking.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    {createdDateFormatted && (
                      <p className="text-[11px] text-muted-foreground">
                        Booked on {createdDateFormatted}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(payment?.status)}
                  </div>
                </div>

                {/* Property & Room Details Content */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Property Image Thumbnail */}
                  <div className="relative h-28 w-full sm:w-32 rounded-2xl overflow-hidden bg-muted shrink-0 border">
                    {propertyImage ? (
                      <Image
                        src={propertyImage}
                        alt={property?.title || "Booked Property"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40 bg-gradient-to-br from-primary/10 via-muted to-muted/80">
                        <DoorOpen className="w-8 h-8" />
                      </div>
                    )}

                    {room?.roomNumber && (
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-lg font-bold">
                        Room {room.roomNumber}
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Property Title */}
                    <div>
                      <h3 className="font-extrabold text-base text-foreground tracking-tight line-clamp-1">
                        {property?.title || "Property Details"}
                      </h3>
                      {property && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">
                            {property.city ? `${property.city}, ` : ""}
                            {property.address}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2 rounded-xl bg-muted/40 border border-border/50">
                        <p className="text-[10px] text-muted-foreground">Move-in Date</p>
                        <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-primary" />
                          <span className="truncate">{startDateFormatted}</span>
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-muted/40 border border-border/50">
                        <p className="text-[10px] text-muted-foreground">Seats Booked</p>
                        <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Users className="w-3 h-3 text-primary" />
                          <span>{booking.seatCount} Seat{booking.seatCount > 1 ? "s" : ""}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Rent & Payment Status Strip */}
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium">Total Amount</p>
                    <p className="text-lg font-extrabold text-primary">
                      ৳{booking.totalAmount?.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-muted-foreground">BDT</span>
                    </p>
                  </div>

                  {isPaid ? (
                    <div className="text-right space-y-0.5">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold justify-end">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Payment Completed</span>
                      </div>
                      {payment?.transactionId && (
                        <p className="text-[10px] font-mono text-muted-foreground">
                          Trx: {payment.transactionId}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-xs font-semibold text-rose-500">
                        Payment Required
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t flex flex-wrap items-center gap-2.5">
                  {/* Pay Now Button (Only when pending and unpaid) */}
                  {isPendingPayment && (
                    <Button
                      size="sm"
                      onClick={() => handlePay(booking)}
                      disabled={isPaying}
                      className="flex-1 h-10 rounded-xl text-xs font-bold gap-2 bg-pink-600 hover:bg-pink-700 text-white shadow-xs"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting bKash...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Now with bKash</span>
                        </>
                      )}
                    </Button>
                  )}

                  {/* Cancel Booking Button (Only for pending bookings) */}
                  {booking.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancellingBooking(booking)}
                      disabled={isCancelling || isPaying}
                      className="h-10 rounded-xl text-xs font-semibold px-3 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    >
                      Cancel
                    </Button>
                  )}

                  {/* View Room Link */}
                  {booking.roomId && (
                    <Link
                      href={`/room/${booking.roomId}`}
                      className={cn(
                        buttonVariants({ variant: isPendingPayment ? "outline" : "default", size: "sm" }),
                        "h-10 rounded-xl text-xs font-semibold px-3.5 gap-1 hover:text-primary transition-colors",
                        !isPendingPayment && "flex-1"
                      )}
                    >
                      <span>View Room</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancellingBooking && (
        <Dialog
          open={Boolean(cancellingBooking)}
          onOpenChange={(open) => !open && setCancellingBooking(null)}
        >
          <DialogContent className="max-w-md rounded-3xl p-6 space-y-4">
            <DialogHeader className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Cancel Booking Request?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to cancel your booking request for Room{" "}
                <span className="font-semibold text-foreground">
                  {cancellingBooking.room?.roomNumber || cancellingBooking.id.slice(0, 8)}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingBooking(null)}
                disabled={isCancelPending}
                className="rounded-xl text-xs h-9 px-4"
              >
                No, Keep Booking
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmCancel}
                disabled={isCancelPending}
                className="rounded-xl text-xs h-9 px-4 font-bold gap-1.5"
              >
                {isCancelPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Booking"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
