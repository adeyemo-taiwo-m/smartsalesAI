"use client";

import React from "react";
import { CheckCircle, Info, AlertCircle, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 w-80 max-w-sm pointer-events-none select-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="h-4.5 w-4.5 text-green-400 shrink-0 mt-0.5" />,
          info: <Info className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />,
          error: <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />,
        };

        const borders = {
          success: "border-l-3 border-l-green-500",
          info: "border-l-3 border-l-blue-500",
          error: "border-l-3 border-l-red-500",
        };

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto bg-dark-card border border-slate-700/50 rounded-xl p-3.5 shadow-widget flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-right-5",
              borders[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 space-y-0.5 text-left">
              <h5 className="text-xs font-bold text-slate-100">{toast.title}</h5>
              <p className="text-[10px] text-slate-400 leading-normal font-medium">{toast.description}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
