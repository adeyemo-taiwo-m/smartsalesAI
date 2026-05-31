import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  variant: "green" | "purple" | "lime" | "orange";
  isCurrency?: boolean;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  variant,
  isCurrency = false,
}: StatCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  // v1.1 §7.8 icon container colors
  const colorVariants = {
    green: {
      bg:   "bg-brand-green/10",
      text: "text-brand-green",
    },
    purple: {
      bg:   "bg-purple-600/10",
      text: "text-purple-400",
    },
    lime: {
      bg:   "bg-green-500/10",
      text: "text-green-400",
    },
    orange: {
      bg:   "bg-orange-500/10",
      text: "text-orange-400",
    },
  };

  const selectedVariant = colorVariants[variant];

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (isCurrency) {
        return `₦${val.toLocaleString()}`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border shadow-card p-5 hover:border-brand-green/30 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider truncate">
            {label}
          </p>
          <h4 className="text-base sm:text-2xl font-bold text-text-primary tabular-nums truncate">
            {formatValue(value)}
          </h4>
          <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs leading-none">
            {isPositive ? (
              <span className="flex items-center gap-0.5 text-green-400 font-medium shrink-0">
                <ArrowUpRight size={12} />
                <span>+{change}%</span>
              </span>
            ) : isNegative ? (
              <span className="flex items-center gap-0.5 text-red-400 font-medium shrink-0">
                <ArrowDownRight size={12} />
                <span>{change}%</span>
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-text-muted font-medium shrink-0">
                <Minus size={12} />
                <span>0%</span>
              </span>
            )}
            <span className="text-text-muted/60 shrink-0">vs yesterday</span>
          </div>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200",
            selectedVariant.bg,
            selectedVariant.text
          )}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
