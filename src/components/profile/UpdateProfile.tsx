"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

import { useUpdateProfile } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileData } from "@/types/auth.type";

interface UpdateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserProfileData | null;
}

export function UpdateProfileDialog({
  open,
  onOpenChange,
  user,
}: UpdateProfileDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // কারেন্ট ইউজার ডাটা অনুযায়ী ফর্মের প্রাথমিক মান
  const currentContact =
    user?.role === "TENANT"
      ? user?.tenant?.contactNumber
      : user?.landlord?.contactNumber;

  const currentAddress =
    user?.role === "TENANT"
      ? user?.tenant?.address
      : user?.landlord?.address;

  const [name, setName] = useState(user?.name || "");
  const [contactNumber, setContactNumber] = useState(currentContact || "");
  const [address, setAddress] = useState(currentAddress || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(user?.name || "");
      setContactNumber(currentContact || "");
      setAddress(currentAddress || "");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [open, user, currentContact, currentAddress]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // ছবি পরিবর্তন হ্যান্ডলার
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার (FormData তৈরি)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // টেক্সট ডাটা JSON আকারে 'data' কী-তে পাঠানো
    const payload = {
      name,
      contactNumber,
      address,
    };
    formData.append("data", JSON.stringify(payload));

    // নতুন ইমেজ ফাইল থাকলে 'profileImage' ফিল্ডে যোগ করা (backend expects profileImage)
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    updateProfile(formData, {
      onSuccess: (res: any) => {
        toast.success("Profile updated successfully");

        const updatedData = res?.data;
        if (typeof window !== "undefined" && user?.id) {
          localStorage.setItem(
            `profile_extra_${user.id}`,
            JSON.stringify({
              contactNumber:
                updatedData?.tenant?.contactNumber ||
                updatedData?.landlord?.contactNumber ||
                contactNumber,
              address:
                updatedData?.tenant?.address ||
                updatedData?.landlord?.address ||
                address,
            })
          );
        }

        if (res?.data) {
          queryClient.setQueryData(["user"], (old: any) => ({
            ...old,
            ...res,
            data: {
              ...old?.data,
              ...res?.data,
            },
          }));
        }

        queryClient.invalidateQueries({ queryKey: ["user"] });
        onOpenChange(false);
      },
      onError: (error: any) => {
        const errorMsg =
          error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "Failed to update profile";
        toast.error(errorMsg);
      },
    });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal profile information and avatar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* প্রোফাইল ইমেজ আপলোড ও প্রিভিউ সেকশন */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
                <AvatarImage
                  src={previewUrl || user?.imageUrl}
                  alt={user?.name}
                />
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Click the camera icon to upload a new picture (Max 5MB)
            </p>
          </div>

          {/* টেক্সট ফিল্ডসমূহ */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. +8801700000000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Dhaka, Bangladesh"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}