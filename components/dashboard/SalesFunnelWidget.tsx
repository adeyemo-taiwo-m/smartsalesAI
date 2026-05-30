"use client";

import React from "react";
import { Filter, ChevronRight } from "lucide-react";
import { MOCK_FUNNEL_DATA } from "@/lib/mock-data";

export function SalesFunnelWidget() {
  const stages = MOCK_FUNNEL_DATA;
  const maxCount = stages[0]?.count || 1;

  return (
    <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card flex flex-col justify-between h-full group hover:border-slate-600 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 duration-200 transition-transform">
          <Filter size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Sales Conversion Funnel</h3>
          <p className="text-xs text-slate-400 mt-0.5">Performance from lead capture to payment close</p>
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
                <div className="absolute -top-3.5 right-4 flex items-center gap-0.5 text-[10px] text-slate-500 font-medium">
                  <span>{conversionRate}% conversion</span>
                  <ChevronRight size={10} />
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{stage.stage}</span>
                <span className="text-text-primary font-bold tabular-nums">
                  {stage.count} <span className="text-slate-500 font-normal text-[10px]">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-dark rounded-full h-2 overflow-hidden border border-slate-800">
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
