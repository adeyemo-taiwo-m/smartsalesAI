"use client";

import React from "react";
import { Filter, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";

export function SalesFunnelWidget() {
  const { leads } = useStore();

  const stages = React.useMemo(() => {
    const counts = {
      new: 0,
      warm: 0,
      hot: 0,
      closed: 0,
    };
    leads.forEach((l) => {
      if (l.status === "new") counts.new++;
      if (l.status === "warm") counts.warm++;
      if (l.status === "hot") counts.hot++;
      if (l.status === "closed") counts.closed++;
    });
    return [
      { stage: "New Leads", count: counts.new, color: "#3b82f6" },
      { stage: "Interested / Warm", count: counts.warm, color: "#8b5cf6" },
      { stage: "Negotiating / Hot", count: counts.hot, color: "#f97316" },
      { stage: "Converted / Closed", count: counts.closed, color: "#10b981" },
    ];
  }, [leads]);

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border shadow-card flex flex-col justify-between h-full group hover:border-brand-green/30 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-dark-border">
        <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 duration-200 transition-transform">
          <Filter size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Sales Conversion Funnel</h3>
          <p className="text-xs text-text-muted mt-0.5">Performance from lead capture to payment close</p>
        </div>
      </div>

      {/* Funnel Content */}
      <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
        {stages.map((stage, i) => {
          const percentage = Math.round((stage.count / maxCount) * 100);
          
          // Calculate conversion from previous stage
          let conversionRate = 0;
          if (i > 0) {
            conversionRate = Math.round((stage.count / stages[i - 1].count) * 100);
          }

          return (
            <div key={stage.stage} className="space-y-1.5 relative">
              {i > 0 && (
                <div className="absolute -top-3.5 right-4 flex items-center gap-0.5 text-[10px] text-text-muted font-medium">
                  <span>{conversionRate}% conversion</span>
                  <ChevronRight size={10} />
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-primary font-medium">{stage.stage}</span>
                <span className="text-text-primary font-bold tabular-nums">
                  {stage.count} <span className="text-text-muted/80 font-normal text-[10px]">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-dark rounded-full h-2 overflow-hidden border border-dark-border">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
