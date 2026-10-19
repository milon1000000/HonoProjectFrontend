import React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "cn";

interface AnalyticsHeaderProps {
  badge: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  };
  title: string;
  description: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  primaryAction?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function AnalyticsHeader({
  badge,
  title,
  description,
  onRefresh,
  isRefreshing = false,
  primaryAction,
}: AnalyticsHeaderProps) {
  const BadgeIcon = badge.icon;
  const ActionIcon = primaryAction?.icon;

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-primary/10 via-muted/30 to-background p-6 sm:p-8 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold w-fit border border-primary/20">
            <BadgeIcon className="size-3.5" />
            <span>{badge.label}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={cn("size-3.5", isRefreshing && "animate-spin")}
              />
              <span>Refresh</span>
            </Button>
          )}

          {primaryAction && (
            <Link
              href={primaryAction.href}
              className={cn(
                buttonVariants({ size: "sm" }),
                "gap-1.5 font-medium"
              )}
            >
              {ActionIcon && <ActionIcon className="size-3.5" />}
              <span>{primaryAction.label}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

