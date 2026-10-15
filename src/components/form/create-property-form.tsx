"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanloardCreateProperty } from "@/hooks";
import { toast } from "@/components/ui/toast";
import {
  PlusCircle,
  Upload,
  X,
  Loader2,
  Building2,
  MapPin,
  Sparkles,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface FormState {
  title: string;
  description: string;
  address: string;
  city: string;
  rentPrice: string;
  totalRooms: string;
  amenities: string[];
}

const initialFormState: FormState = {
  title: "",
  description: "",
  address: "",
  city: "",
  rentPrice: "",
  totalRooms: "",
  amenities: [],
};

const SUGGESTED_AMENITIES = [
  "ওয়াই-ফাই",
  "এসি",
  "পার্কিং",
  "লিফট",
  "সিসিটিভি",
  "জেনারেটর",
  "২৪ ঘণ্টা নিরাপত্তা",
];

export default function CreatePropertyDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [amenityInput, setAmenityInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    title?: string;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createProperty, isPending } = useLanloardCreateProperty();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add one or multiple amenities (comma separated or single)
  const handleAddAmenity = () => {
    const trimmed = amenityInput.trim();
    if (!trimmed) return;

    const items = trimmed
      .split(",")
      .map((item) => item.trim())
      .filter((item) => Boolean(item) && !form.amenities.includes(item));

    if (items.length > 0) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, ...items],
      }));
    }
    setAmenityInput("");
  };

  // Remove single amenity chip
  const handleRemoveAmenity = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Quick add suggested amenity
  const handleQuickAdd = (item: string) => {
    if (!form.amenities.includes(item)) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, item],
      }));
    }
  };

  const triggerError = (title: string, description: string) => {
    setStatusMessage({ type: "error", title, message: description });
    toast.add({
      title,
      description,
      type: "error",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const totalCount = selectedFiles.length + files.length;

    if (totalCount > 5) {
      triggerError("Image Limit Exceeded", "You can upload a maximum of 5 images.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index]);
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    filePreviews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setFilePreviews([]);
    setAmenityInput("");
    setStatusMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (form.title.trim().length < 3) {
      triggerError("Validation Error", "Title must be at least 3 characters long.");
      return;
    }

    if (form.description.trim().length < 10) {
      triggerError("Validation Error", "Description must be at least 10 characters long.");
      return;
    }

    if (form.address.trim().length < 5) {
      triggerError("Validation Error", "Address must be at least 5 characters long.");
      return;
    }

    if (form.city.trim().length < 2) {
      triggerError("Validation Error", "City is required.");
      return;
    }

    const rentPriceNum = Number(form.rentPrice);
    if (!rentPriceNum || rentPriceNum <= 0) {
      triggerError("Validation Error", "Please enter a valid positive rent price.");
      return;
    }

    const totalRoomsNum = Number(form.totalRooms);
    if (!totalRoomsNum || totalRoomsNum <= 0) {
      triggerError("Validation Error", "Please enter a valid number of rooms.");
      return;
    }

    if (selectedFiles.length === 0) {
      triggerError("Image Required", "Please upload at least 1 property image (max 5).");
      return;
    }

    // Include any typed text in the amenity input that wasn't added via Enter/Button
    let finalAmenities = [...form.amenities];
    if (amenityInput.trim()) {
      const extraItems = amenityInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => Boolean(item) && !finalAmenities.includes(item));
      finalAmenities = [...finalAmenities, ...extraItems];
    }

    // Build FormData
    const formData = new FormData();
    const propertyData = {
      title: form.title.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      rentPrice: rentPriceNum,
      totalRooms: totalRoomsNum,
      amenities: finalAmenities,
      isAvailable: true,
    };

    formData.append("data", JSON.stringify(propertyData));
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    createProperty(formData, {
      onSuccess: () => {
        toast.add({
          title: "Property Created",
          description: "Your property has been successfully created!",
          type: "success",
        });
        resetForm();
        setOpen(false);
      },
      onError: (err: any) => {
        const errorMsg =
          err?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.";
        triggerError("Failed to Create Property", errorMsg);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="gap-2 font-semibold shadow-md">
            <PlusCircle className="h-4 w-4" />
            Create Property
          </Button>
        }
      />

      <DialogContent className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Building2 className="h-4 w-4" />
            Property Management
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Create Property
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Fill in the details below to list a new property.
          </DialogDescription>
        </DialogHeader>

        {/* In-Dialog Status / Error Banner */}
        {statusMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 animate-in fade-in-0 duration-200 ${
              statusMessage.type === "error"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {statusMessage.type === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                {statusMessage.title && (
                  <p className="font-semibold">{statusMessage.title}</p>
                )}
                <p className="opacity-90">{statusMessage.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:opacity-70 rounded-md transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Property Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. আধুনিক বিলাসবহুল অ্যাপার্টমেন্ট"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Description <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="e.g. প্রশস্ত ও সম্পূর্ণ ফার্নিশড অ্যাপার্টমেন্ট। এখানে উচ্চগতির ইন্টারনেট, ২৪ ঘণ্টা নিরাপত্তা এবং আধুনিক বিভিন্ন সুবিধা রয়েছে। পরিবার বা পেশাজীবীদের জন্য উপযুক্ত।"
              value={form.description}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-semibold">
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="e.g. বাড়ি ১২, রোড ৫, সেক্টর ৩"
                value={form.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-semibold flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="e.g. ঢাকা"
                value={form.city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Rent & Rooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rentPrice" className="text-xs font-semibold">
                Rent Price (BDT) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rentPrice"
                name="rentPrice"
                type="number"
                min="1"
                placeholder="e.g. 25000"
                value={form.rentPrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="totalRooms" className="text-xs font-semibold">
                Total Rooms <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalRooms"
                name="totalRooms"
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={form.totalRooms}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Amenities - Custom input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amenity-input" className="text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Amenities (সুবিধাসমূহ)
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {form.amenities.length} added
              </span>
            </div>

            {/* Input field to type custom amenities */}
            <div className="flex items-center gap-2">
              <Input
                id="amenity-input"
                placeholder="যেমন: ওয়াই-ফাই, এসি, পার্কিং, লিফট (লিখে Enter বা কমা দিন)"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAmenity}
                className="shrink-0 gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>

            {/* Selected Amenity Chips */}
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.amenities.map((item, index) => (
                  <Badge
                    key={`${item}-${index}`}
                    variant="secondary"
                    className="gap-1 pl-2.5 pr-1 py-1 text-xs font-normal bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="hover:bg-primary/20 rounded-full p-0.5 text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested quick clicks */}
            <div className="pt-1">
              <p className="text-[11px] text-muted-foreground mb-1.5">
                ক্লিক করে যোগ করুন:
              </p>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_AMENITIES.map((suggestion) => {
                  const isAlreadyAdded = form.amenities.includes(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => handleQuickAdd(suggestion)}
                      className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                        isAlreadyAdded
                          ? "opacity-40 cursor-not-allowed bg-muted border-transparent"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-border"
                      }`}
                    >
                      + {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                Property Photos <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {selectedFiles.length} of 5 uploaded
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/10 border-border"
            >
              <Upload className="h-7 w-7 text-muted-foreground" />
              <div className="text-xs">
                <span className="font-semibold text-primary">Click to upload photos</span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                PNG, JPG, or WEBP (1 to 5 images required)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Thumbnail previews */}
            {filePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {filePreviews.map((url, index) => (
                  <div
                    key={index}
                    className="relative group h-20 rounded-lg overflow-hidden border bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`Upload preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dialog Action Footer */}
          <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Property...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Create Property
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
