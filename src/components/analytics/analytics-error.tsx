import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function AnalyticsError({
  message = "Failed to load analytics data. Please try again.",
  onRetry,
}: AnalyticsErrorProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-4 max-w-lg mx-auto my-12">
      <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
        <AlertCircle className="size-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Error Loading Analytics
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 mx-auto cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}

