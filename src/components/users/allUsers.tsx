"use client";

import React, { useState, useEffect } from "react";
import {
  useGetAllUsers,
  useBlockUnblockUser,
  useDeleteUser,
} from "@/hooks/admin.hook";
import { IUser, UserRole, UserStatus } from "@/types/user.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "cn";
import {
  Users,
  Search,
  RefreshCw,
  MoreVertical,
  ShieldAlert,
  Building2,
  User,
  Lock,
  Unlock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  ShieldCheck,
  Ban,
  Calendar,
  X,
  Filter,
} from "lucide-react";

export default function AllUsers() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Modal states
  const [targetUserForBlock, setTargetUserForBlock] = useState<IUser | null>(
    null
  );
  const [targetUserForDelete, setTargetUserForDelete] = useState<IUser | null>(
    null
  );

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Query Hook
  const { data, isLoading, isError, refetch, isFetching } = useGetAllUsers({
    page,
    limit,
    searchTerm: searchTerm || undefined,
    role: roleFilter === "ALL" ? undefined : roleFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  // Mutations
  const { mutateAsync: blockUnblockMutate, isPending: isBlockPending } =
    useBlockUnblockUser();
  const { mutateAsync: deleteUserMutate, isPending: isDeletePending } =
    useDeleteUser();

  const users: IUser[] = Array.isArray(data?.data) ? data.data : [];
  const meta = data?.meta;
  const totalUsers = meta?.total ?? users.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(totalUsers / limit));

  // Handle Block / Unblock Confirmation
  const handleConfirmBlockToggle = async () => {
    if (!targetUserForBlock) return;
    try {
      const isCurrentlyActive = targetUserForBlock.status === "ACTIVE";
      const newStatus = isCurrentlyActive ? "BLOCKED" : "ACTIVE";

      await blockUnblockMutate({
        id: targetUserForBlock.id,
        status: newStatus,
      });

      toast.success(
        isCurrentlyActive
          ? `User "${targetUserForBlock.name}" has been blocked.`
          : `User "${targetUserForBlock.name}" has been unblocked.`
      );
      setTargetUserForBlock(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user status");
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!targetUserForDelete) return;
    try {
      await deleteUserMutate(targetUserForDelete.id);
      toast.success(`User "${targetUserForDelete.name}" has been deleted.`);
      setTargetUserForDelete(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            <ShieldAlert className="size-3 text-purple-600 dark:text-purple-400" />
            Admin
          </span>
        );
      case "LANDLORD":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <Building2 className="size-3 text-blue-600 dark:text-blue-400" />
            Landlord
          </span>
        );
      case "TENANT":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <User className="size-3 text-emerald-600 dark:text-emerald-400" />
            Tenant
          </span>
        );
    }
  };

  const renderStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Lock className="size-3 text-rose-600 dark:text-rose-400" />
            Blocked
          </span>
        );
      case "DELETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">
            Deleted
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const hasActiveFilters =
    searchInput.trim() !== "" ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-primary/10 via-muted/30 to-background p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold w-fit border border-primary/20">
              <Users className="size-3.5" />
              <span>User Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              All System Users
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              View registered users, inspect roles, toggle account access
              (block / unblock), and manage user lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={cn("size-3.5", isFetching && "animate-spin")}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by user name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background/60 text-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background/60 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Roles</option>
              <option value="TENANT">Tenant Only</option>
              <option value="LANDLORD">Landlord Only</option>
              <option value="ADMIN">Admin Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background/60 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Users</option>
              <option value="BLOCKED">Blocked Users</option>
            </select>
          </div>
        </div>

        {/* Status / Active Filter Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
          <div className="text-muted-foreground">
            Total users found:{" "}
            <span className="font-bold text-foreground">{totalUsers}</span>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground gap-1 text-xs"
            >
              <X className="size-3" />
              <span>Clear filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3.5 px-4 font-bold text-foreground">
                  User Info
                </TableHead>
                <TableHead className="py-3.5 px-4 font-bold text-foreground">
                  Role
                </TableHead>
                <TableHead className="py-3.5 px-4 font-bold text-foreground">
                  Status
                </TableHead>
                <TableHead className="py-3.5 px-4 font-bold text-foreground">
                  Auth & Profile
                </TableHead>
                <TableHead className="py-3.5 px-4 font-bold text-foreground">
                  Joined Date
                </TableHead>
                <TableHead className="py-3.5 px-4 font-bold text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-muted shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-32 bg-muted rounded" />
                          <div className="h-2.5 w-48 bg-muted rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-6 w-20 bg-muted rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-6 w-16 bg-muted rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-4 w-24 bg-muted rounded" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-4 w-20 bg-muted rounded" />
                    </TableCell>
                    <TableCell className="py-4 px-4 text-right">
                      <div className="size-8 bg-muted rounded-lg ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                // Error Row
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-destructive space-y-3"
                  >
                    <AlertTriangle className="size-8 mx-auto" />
                    <p className="font-semibold text-sm">
                      Failed to load users data
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="mx-auto"
                    >
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                // Empty State Row
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="size-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                        <Users className="size-6" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">
                        No users found
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {hasActiveFilters
                          ? "Try adjusting your search query or filter settings."
                          : "There are currently no users in the database."}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="mt-2"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // User Data Rows
                users.map((user) => {
                  const isAdmin = user.role === "ADMIN";
                  const isBlocked = user.status === "BLOCKED";
                  const dateStr = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A";

                  return (
                    <TableRow
                      key={user.id}
                      className={cn(
                        "transition-colors hover:bg-muted/30 border-b border-border/40",
                        isBlocked && "bg-rose-500/[0.02]"
                      )}
                    >
                      {/* User Info */}
                      <TableCell className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar size="default" className="border">
                            {user.imageUrl && (
                              <AvatarImage
                                src={user.imageUrl}
                                alt={user.name}
                              />
                            )}
                            <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-bold text-xs sm:text-sm text-foreground truncate flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isAdmin && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold">
                                  You / Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 shrink-0" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="py-3.5 px-4">
                        {renderRoleBadge(user.role)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5 px-4">
                        {renderStatusBadge(user.status)}
                      </TableCell>

                      {/* Auth / Profile Details */}
                      <TableCell className="py-3.5 px-4 text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            {user.authProvider === "GOOGLE" ? (
                              <span className="font-medium text-foreground">
                                Google Sign-In
                              </span>
                            ) : (
                              <span>Email & Password</span>
                            )}
                          </span>
                          {user.landlord && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                              Verification: {user.landlord.verificationStatus}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="py-3.5 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3 text-muted-foreground" />
                          <span>{dateStr}</span>
                        </div>
                      </TableCell>

                      {/* 3-Dot Actions */}
                      <TableCell className="py-3.5 px-4 text-right">
                        {isAdmin ? (
                          <span className="text-[11px] text-muted-foreground italic px-2">
                            Protected
                          </span>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex size-8 items-center justify-center rounded-lg border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              aria-label="User actions"
                            >
                              <MoreVertical className="size-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              sideOffset={4}
                              className="min-w-44 p-1 rounded-xl shadow-lg border border-border/60 bg-popover"
                            >
                              {/* Block / Unblock option */}
                              {isBlocked ? (
                                <DropdownMenuItem
                                  onClick={() => setTargetUserForBlock(user)}
                                  className="gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400 focus:text-emerald-600 focus:bg-emerald-500/10"
                                >
                                  <Unlock className="size-3.5" />
                                  <span>Unblock User</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => setTargetUserForBlock(user)}
                                  className="gap-2 cursor-pointer text-amber-600 dark:text-amber-400 focus:text-amber-600 focus:bg-amber-500/10"
                                >
                                  <Ban className="size-3.5" />
                                  <span>Block User</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator className="my-1 border-t border-border/40" />

                              {/* Delete option */}
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setTargetUserForDelete(user)}
                                className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {totalUsers > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border/60 bg-muted/20 text-xs">
            <div className="text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {Math.min((page - 1) * limit + 1, totalUsers)}
              </span>{" "}
              to{" "}
              <span className="font-bold text-foreground">
                {Math.min(page * limit, totalUsers)}
              </span>{" "}
              of <span className="font-bold text-foreground">{totalUsers}</span>{" "}
              users
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="gap-1 h-8 rounded-lg text-xs"
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </Button>

              <span className="px-2 font-medium text-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="gap-1 h-8 rounded-lg text-xs"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog: Block / Unblock */}
      <Dialog
        open={Boolean(targetUserForBlock)}
        onOpenChange={(open) => !open && setTargetUserForBlock(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <div
              className={cn(
                "size-12 rounded-full flex items-center justify-center",
                targetUserForBlock?.status === "ACTIVE"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-emerald-500/10 text-emerald-600"
              )}
            >
              {targetUserForBlock?.status === "ACTIVE" ? (
                <Ban className="size-6" />
              ) : (
                <Unlock className="size-6" />
              )}
            </div>

            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              {targetUserForBlock?.status === "ACTIVE"
                ? `Block User Account?`
                : `Unblock User Account?`}
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {targetUserForBlock?.status === "ACTIVE" ? (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold text-foreground">
                    {targetUserForBlock?.name}
                  </span>{" "}
                  ({targetUserForBlock?.email})? They will no longer be able to
                  log into their account or make bookings until unblocked.
                </>
              ) : (
                <>
                  Are you sure you want to unblock{" "}
                  <span className="font-semibold text-foreground">
                    {targetUserForBlock?.name}
                  </span>{" "}
                  ({targetUserForBlock?.email})? Their login and booking
                  privileges will be fully restored.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTargetUserForBlock(null)}
              disabled={isBlockPending}
              className="rounded-xl text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant={
                targetUserForBlock?.status === "ACTIVE" ? "destructive" : "default"
              }
              size="sm"
              onClick={handleConfirmBlockToggle}
              disabled={isBlockPending}
              className="rounded-xl text-xs h-9 px-4 font-bold gap-1.5 cursor-pointer"
            >
              {isBlockPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : targetUserForBlock?.status === "ACTIVE" ? (
                "Yes, Block User"
              ) : (
                "Yes, Unblock User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog: Delete User */}
      <Dialog
        open={Boolean(targetUserForDelete)}
        onOpenChange={(open) => !open && setTargetUserForDelete(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <Trash2 className="size-6" />
            </div>

            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Delete User Account?
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete user{" "}
              <span className="font-semibold text-foreground">
                {targetUserForDelete?.name}
              </span>{" "}
              ({targetUserForDelete?.email})? This action will mark the user as
              deleted and cancel any active/pending bookings. This action cannot
              be easily undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTargetUserForDelete(null)}
              disabled={isDeletePending}
              className="rounded-xl text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeletePending}
              className="rounded-xl text-xs h-9 px-4 font-bold gap-1.5 cursor-pointer"
            >
              {isDeletePending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Yes, Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
