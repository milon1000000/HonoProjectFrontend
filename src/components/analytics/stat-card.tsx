import React from "react";
import Link from "next/link";
import { cn } from "cn";
import { ArrowUpRight } from "lucide-react";

export type StatCardColor =
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "purple"
  | "indigo";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: StatCardColor;
  subValue?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "emerald" | "amber" | "rose" | "blue" | "purple" | "default";
  };
  href?: string;
}

const colorStyles: Record<
  StatCardColor,
  {
    iconBg: string;
    iconText: string;
    cardBorder: string;
    highlight: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    iconText: "text-blue-600 dark:text-blue-400",
    cardBorder: "hover:border-blue-500/30",
    highlight: "from-blue-500/5 to-transparent",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconText: "text-emerald-600 dark:text-emerald-400",
    cardBorder: "hover:border-emerald-500/30",
    highlight: "from-emerald-500/5 to-transparent",
  },
  amber: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    iconText: "text-amber-600 dark:text-amber-400",
    cardBorder: "hover:border-amber-500/30",
    highlight: "from-amber-500/5 to-transparent",
  },
  rose: {
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    iconText: "text-rose-600 dark:text-rose-400",
    cardBorder: "hover:border-rose-500/30",
    highlight: "from-rose-500/5 to-transparent",
  },
  purple: {
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    iconText: "text-purple-600 dark:text-purple-400",
    cardBorder: "hover:border-purple-500/30",
    highlight: "from-purple-500/5 to-transparent",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    iconText: "text-indigo-600 dark:text-indigo-400",
    cardBorder: "hover:border-indigo-500/30",
    highlight: "from-indigo-500/5 to-transparent",
  },
};

const badgeStyles: Record<string, string> = {
  default: "bg-muted text-muted-foreground border-border/50",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
  subValue,
  badge,
  href,
}: StatCardProps) {
  const styles = colorStyles[color];

  const content = (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        styles.cardBorder
      )}
    >
      {/* Subtle top gradient accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-50 pointer-events-none transition-opacity group-hover:opacity-100",
          styles.highlight
        )}
      />

      <div className="relative z-10 flex flex-col justify-between gap-3 h-full">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <div
            className={cn(
              "flex items-center justify-center size-9 rounded-xl border border-border/40 transition-transform duration-300 group-hover:scale-110",
              styles.iconBg
            )}
          >
            <Icon className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {description}
            </p>
          )}
        </div>

        {(subValue || badge || href) && (
          <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
            {subValue ? (
              <div className="text-muted-foreground truncate">{subValue}</div>
            ) : <span />}

            <div className="flex items-center gap-1.5 shrink-0">
              {badge && (
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                    badgeStyles[badge.variant || "default"]
                  )}
                >
                  {badge.text}
                </span>
              )}
              {href && (
                <span className="text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center">
                  <ArrowUpRight className="size-3.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

