"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetSingleLandlord,
  useApproveRejectLandlord,
} from "@/hooks";
import { Landlord } from "@/types/landloard.type";
import { toast } from "@/components/ui/toast";
import {
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Home,
  Calendar,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface SingleLandlordSheetProps {
  landlordId: string;
}

export function SingleLandloardSheet({ landlordId }: SingleLandlordSheetProps) {
  const [open, setOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = useGetSingleLandlord(open ? landlordId : "");
  const { mutate: approveReject, isPending: isActionPending } =
    useApproveRejectLandlord();

  const landlord: Landlord | undefined = data?.data;

  const handleApprove = () => {
    approveReject(
      {
        landlordId,
        verificationStatus: "APPROVED",
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Application Approved",
            description: "Landlord has been approved and login credentials sent via email.",
            type: "success",
          });
          setOpen(false);
        },
        onError: (err: any) => {
          toast.add({
            title: "Approval Failed",
            description:
              err?.data?.message || err?.message || "Failed to approve landlord.",
            type: "error",
          });
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.add({
        title: "Reason Required",
        description: "Please specify a reason for rejecting this application.",
        type: "error",
      });
      return;
    }

    approveReject(
      {
        landlordId,
        verificationStatus: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Application Rejected",
            description: "Landlord application has been rejected.",
            type: "success",
          });
          setIsRejecting(false);
          setRejectionReason("");
          setOpen(false);
        },
        onError: (err: any) => {
          toast.add({
            title: "Rejection Failed",
            description:
              err?.data?.message || err?.message || "Failed to reject landlord.",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setIsRejecting(false);
          setRejectionReason("");
        }
      }}
    >
      <SheetTrigger render={<Button variant="outline" size="sm">View</Button>} />
      
      {/* এখানে px-6 যোগ করা হয়েছে যাতে দুপাশে সুন্দর স্পেসিং থাকে */}
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-6">
        <SheetHeader className="text-left border-b pb-4">
          <SheetTitle className="text-lg font-bold">Landlord Profile Review</SheetTitle>
          <SheetDescription className="text-xs">
            Review detailed application info and verify account status.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Loading profile...</span>
          </div>
        ) : !landlord ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            Landlord details could not be loaded.
          </div>
        ) : (
          <div className="flex-1 space-y-6 py-4">
            {/* User Profile Card */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={landlord.user?.imageUrl || ""} alt={landlord.name} />
                <AvatarFallback className="text-lg font-bold uppercase text-primary bg-primary/10">
                  {landlord.name?.charAt(0) || "L"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground truncate capitalize">
                    {landlord.name}
                  </h3>
                  {landlord.verificationStatus === "APPROVED" && (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 text-[10px] gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </Badge>
                  )}
                  {landlord.verificationStatus === "PENDING" && (
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 text-[10px] gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </Badge>
                  )}
                  {landlord.verificationStatus === "REJECTED" && (
                    <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-[10px] gap-1">
                      <XCircle className="w-3 h-3" /> Rejected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{landlord.email}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  ID: <span className="font-mono">{landlord.id}</span>
                </p>
              </div>
            </div>

            {/* Contact & Verification Info */}
            <div className="grid gap-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> Phone Number
                </span>
                <span className="font-medium font-mono text-foreground">
                  {landlord.contactNumber || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" /> NID / Passport
                </span>
                <span className="font-medium font-mono text-foreground">
                  {landlord.nidOrPassportNumber || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Address
                </span>
                <span className="font-medium text-foreground text-right truncate max-w-[200px]">
                  {landlord.address || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Registered
                </span>
                <span className="font-medium text-foreground">
                  {new Date(landlord.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Rejection Alert if already rejected */}
            {landlord.verificationStatus === "REJECTED" && landlord.rejectionReason && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-4 w-4" /> Rejection Reason:
                </div>
                <p className="mt-1 text-muted-foreground">{landlord.rejectionReason}</p>
              </div>
            )}

            {/* Listed Properties Info */}
            <div className="rounded-xl border bg-card p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                <span className="flex items-center gap-1.5">
                  <Home className="h-4 w-4 text-primary" /> Managed Properties
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold">
                  {landlord.properties?.length || 0}
                </span>
              </div>

              {landlord.properties && landlord.properties.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {landlord.properties.slice(0, 3).map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs">
                      <span className="font-medium truncate max-w-[200px]">{prop.title}</span>
                      <span className="font-semibold text-primary">৳{prop.rentPrice?.toLocaleString()}</span>
                    </div>
                  ))}
                  {landlord.properties.length > 3 && (
                    <p className="text-[11px] text-center text-muted-foreground pt-1">
                      +{landlord.properties.length - 3} more properties
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No properties registered yet.
                </p>
              )}
            </div>

            {/* Reject Reason Form */}
            {isRejecting && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                  <XCircle className="h-4 w-4" /> Provide Rejection Reason
                </div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter detailed reason for rejection (required)..."
                  className="w-full rounded-lg border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-destructive min-h-[75px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isActionPending}
                    onClick={() => {
                      setIsRejecting(false);
                      setRejectionReason("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isActionPending || !rejectionReason.trim()}
                    onClick={handleReject}
                  >
                    {isActionPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Rejecting...
                      </>
                    ) : (
                      "Confirm Reject"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        <SheetFooter className="border-t pt-4 flex-row gap-2 sm:justify-between items-center">
          <SheetClose render={<Button variant="outline" size="sm">Close</Button>} />

          {landlord && landlord.verificationStatus === "PENDING" && !isRejecting && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                disabled={isActionPending}
                onClick={() => setIsRejecting(true)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isActionPending}
                onClick={handleApprove}
              >
                {isActionPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                  </>
                )}
              </Button>
            </div>
          )}

          {landlord && landlord.verificationStatus === "APPROVED" && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Already Approved
            </span>
          )}

          {landlord && landlord.verificationStatus === "REJECTED" && (
            <span className="text-xs text-destructive font-medium flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" /> Application Rejected
            </span>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}