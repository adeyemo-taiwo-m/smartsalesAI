import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "hot" | "warm" | "closed" | "lost" | "completed" | "pending" | "refunded";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  withDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, withDot = true, className = "" }: StatusBadgeProps) {
  const normStatus = status.toLowerCase() as BadgeVariant;

  const config: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string; label: string }> = {
    new: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
      label: "New",
    },
    hot: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      dot: "bg-red-400",
      label: "Hot",
    },
    warm: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      dot: "bg-orange-400",
      label: "Warm",
    },
    closed: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
      dot: "bg-green-400",
      label: "Closed",
    },
    lost: {
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/20",
      dot: "bg-slate-400",
      label: "Lost",
    },
    completed: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
      dot: "bg-green-400",
      label: "Completed",
    },
    pending: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      dot: "bg-orange-400",
      label: "Pending",
    },
    refunded: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      dot: "bg-red-400",
      label: "Refunded",
    },
  };

  const badge = config[normStatus] || {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badge.bg,
        badge.text,
        badge.border,
        className
      )}
    >
      {withDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot, normStatus === "hot" && "animate-pulse")} />
      )}
      <span>{badge.label}</span>
    </span>
  );
}
