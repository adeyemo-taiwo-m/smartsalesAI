import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "chat" | "table";
  className?: string;
}

export function LoadingSkeleton({ variant = "card", className = "" }: LoadingSkeletonProps) {
  if (variant === "list") {
    return (
      <div className={cn("space-y-4 w-full", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-dark-card border border-slate-700/50 rounded-xl animate-pulse">
            <div className="w-9 h-9 rounded-full bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-800 rounded w-1/3" />
              <div className="h-2.5 bg-slate-800 rounded w-2/3" />
            </div>
            <div className="w-8 h-4 bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chat") {
    return (
      <div className={cn("space-y-4 w-full p-4 flex flex-col justify-end min-h-[300px]", className)}>
        <div className="self-start w-2/3 space-y-2 animate-pulse">
          <div className="h-3.5 bg-slate-800 rounded w-1/4" />
          <div className="h-10 bg-slate-800/50 rounded-lg rounded-tl-none w-full" />
        </div>
        <div className="self-end w-2/3 space-y-2 animate-pulse">
          <div className="h-3.5 bg-slate-800 rounded w-1/4 ml-auto" />
          <div className="h-12 bg-blue-900/20 rounded-lg rounded-tr-none w-full border border-blue-500/10" />
        </div>
        <div className="self-start w-1/2 space-y-2 animate-pulse">
          <div className="h-3.5 bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-800/50 rounded-lg rounded-tl-none w-full" />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("bg-dark-card rounded-xl border border-slate-700/50 overflow-hidden w-full space-y-4 p-5 animate-pulse", className)}>
        <div className="h-4 bg-slate-800 rounded w-1/6 mb-6" />
        {[1, 2, 3, 5].map((i) => (
          <div key={i} className="flex gap-4 border-b border-slate-800 pb-4 last:border-0 last:pb-0">
            <div className="h-8 bg-slate-800 rounded flex-1" />
            <div className="h-8 bg-slate-800 rounded flex-1" />
            <div className="h-8 bg-slate-800 rounded flex-1" />
            <div className="h-8 bg-slate-800 rounded flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("bg-dark-card rounded-xl border border-slate-700/50 p-5 w-full space-y-4 animate-pulse", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-slate-800 rounded w-1/3" />
          <div className="h-7 bg-slate-800 rounded w-1/2" />
          <div className="h-3.5 bg-slate-800 rounded w-1/4" />
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0" />
      </div>
    </div>
  );
}
