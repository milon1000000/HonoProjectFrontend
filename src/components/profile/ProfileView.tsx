"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  ShieldCheck,
  Calendar,
  UserCheck,
  Edit3,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
} from "lucide-react";
import { UserProfileData } from "@/types/auth.type";
import { UpdateProfileDialog } from "./UpdateProfile";

interface ProfileViewProps {
  user?: UserProfileData;
  isLoading: boolean;
}

export function ProfileView({ user, isLoading }: ProfileViewProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
        <Card className="overflow-hidden">
          <Skeleton className="h-32 w-full" />
          <CardContent className="px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Skeleton className="-mt-14 h-24 w-24 rounded-full border-4 border-background" />
                <div className="space-y-2 text-center sm:text-left">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-52" />
                </div>
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  // ইউজার ডেটা না থাকলে
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-base">User data not found.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // নামের প্রথম অক্ষর দিয়ে Avatar Fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // জয়েন করার তারিখ ফরম্যাট
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const contactNumber =
    user.role === "TENANT"
      ? user.tenant?.contactNumber
      : user.landlord?.contactNumber;

  const address =
    user.role === "TENANT"
      ? user.tenant?.address
      : user.landlord?.address;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* প্রোফাইল হেডার */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-muted" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Avatar className="-mt-14 h-24 w-24 rounded-full border-4 border-background shadow-md">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {user.name}
                  </h1>
                  <Badge
                    variant={user.status === "ACTIVE" ? "default" : "secondary"}
                    className="capitalize font-medium"
                  >
                    {user.status.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 cursor-pointer"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* বিস্তারিত তথ্যাবলি */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* একাউন্ট তথ্য কার্ড */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your personal and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">User Role</span>
              <Badge variant="outline" className="font-semibold tracking-wide">
                {user.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Contact Number
              </span>
              <span className="font-medium text-foreground">
                {contactNumber || "Not provided"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Address
              </span>
              <span className="font-medium text-foreground">
                {address || "Not provided"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Auth Provider</span>
              <span className="font-medium text-foreground">
                {user.authProvider}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Joined Date</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {joinDate}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* সিকিউরিটি ও স্ট্যাটাস কার্ড */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Security & Status
            </CardTitle>
            <CardDescription>
              Verification status and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Email Verified</span>
              {user.emailVerified ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <XCircle className="h-4 w-4" /> Unverified
                </span>
              )}
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Password Update</span>
              {user.needPasswordChange ? (
                <Badge variant="destructive">Required</Badge>
              ) : (
                <span className="text-muted-foreground font-medium">Not Required</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Status</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {user.status}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* এডিট প্রোফাইল ডায়ালগ */}
      <UpdateProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
      />
    </div>
  );
}