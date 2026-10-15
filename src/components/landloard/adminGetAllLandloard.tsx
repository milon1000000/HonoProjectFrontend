"use client";

import React from "react";
import { useGetAllLandlord } from "@/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import { Landlord } from "@/types/landloard.type";
import { SingleLandloardSheet } from "./singleLandloardSheet";

export default function AdminGetAllLandlord() {
  const { data, isLoading } = useGetAllLandlord();
  const landlords: Landlord[] = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header Info */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Landlord Management</h1>
        <p className="text-sm text-muted-foreground">
          Total {landlords.length} landlords registered on the platform. Review and verify applications.
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[260px]">Landlord</TableHead>
              <TableHead>Contact & Address</TableHead>
              <TableHead>NID / Passport</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {landlords.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-28 text-center text-muted-foreground"
                >
                  No landlords found.
                </TableCell>
              </TableRow>
            ) : (
              landlords.map((landlord) => (
                <TableRow key={landlord.id} className="hover:bg-muted/40">
                  {/* Name & Avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={landlord.user?.imageUrl || ""}
                          alt={landlord.name || "Landlord"}
                        />
                        <AvatarFallback className="font-semibold uppercase text-muted-foreground">
                          {landlord.name?.slice(0, 2) || "L"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground capitalize">
                          {landlord.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {landlord.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact & Location */}
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono text-foreground">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {landlord.contactNumber || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {landlord.address || "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Identification */}
                  <TableCell>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded border">
                      {landlord.nidOrPassportNumber || "N/A"}
                    </span>
                  </TableCell>

                  {/* Properties count */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <Home className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{landlord.properties?.length || 0} Listed</span>
                    </div>
                  </TableCell>

                  {/* Verification Status */}
                  <TableCell>
                    {landlord.verificationStatus === "APPROVED" && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </Badge>
                    )}
                    {landlord.verificationStatus === "PENDING" && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                    {landlord.verificationStatus === "REJECTED" && (
                      <Badge
                        variant="outline"
                        className="border-destructive/30 bg-destructive/10 text-destructive gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </Badge>
                    )}
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(landlord.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>

                  {/* Action Column with Landlord Sheet */}
                  <TableCell className="text-right">
                    <SingleLandloardSheet landlordId={landlord.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}