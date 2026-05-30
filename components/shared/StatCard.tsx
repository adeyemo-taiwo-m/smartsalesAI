import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  variant: "blue" | "purple" | "green" | "orange";
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

  const colorVariants = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/10",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/10",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/10",
    },
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/10",
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
    <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card p-5 hover:border-blue-500/30 hover:shadow-card-hover transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <h4 className="text-2xl font-bold text-slate-50 tabular-nums">
            {formatValue(value)}
          </h4>
          <div className="flex items-center gap-1.5 text-xs">
            {isPositive ? (
              <span className="flex items-center gap-0.5 text-green-400 font-medium">
                <ArrowUpRight size={14} />
                <span>+{change}%</span>
              </span>
            ) : isNegative ? (
              <span className="flex items-center gap-0.5 text-red-400 font-medium">
                <ArrowDownRight size={14} />
                <span>{change}%</span>
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-slate-400 font-medium">
                <Minus size={14} />
                <span>0%</span>
              </span>
            )}
            <span className="text-slate-500">vs yesterday</span>
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
