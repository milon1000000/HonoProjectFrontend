import React from "react";
import CreatePropertyDialog from "@/components/form/create-property-form";
import MyProperty from "@/components/landloard/myProperty";

export default function CreatePropertyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Section: Create Property Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md p-6 sm:p-8 border rounded-2xl bg-card shadow-xs text-center space-y-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Create Property
          </h1>
          <p className="text-xs text-muted-foreground">
            Click the button below to add a new property listing.
          </p>
          <div className="pt-2 flex justify-center">
            <CreatePropertyDialog />
          </div>
        </div>
      </div>

      {/* Bottom Section: My Properties Table */}
      <div className="w-full">
        <MyProperty />
      </div>
    </div>
  );
}
