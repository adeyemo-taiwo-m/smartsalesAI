"use client";

import React from "react";
import Link from "next/link";
import { DollarSign, ArrowUpRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChannelIcon } from "@/components/shared/ChannelIcon";

export function RecentSalesTable() {
  const { sales } = useStore();
  const recentSales = sales.slice(0, 5); // Show last 5 sales

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border shadow-card overflow-hidden group hover:border-blue-500/30 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 duration-200 transition-transform">
            <DollarSign size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Recent Sales Ledger</h3>
            <p className="text-xs text-text-muted mt-0.5">Latest transactions processed across channels</p>
          </div>
        </div>
        <Link
          href="/dashboard/sales"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark/30 select-none text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              <th className="px-5 py-3.5 text-left">Customer</th>
              <th className="px-5 py-3.5 text-left">Product</th>
              <th className="px-5 py-3.5 text-left">Channel</th>
              <th className="px-5 py-3.5 text-right">Amount</th>
              <th className="px-5 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border/40 text-xs">
            {recentSales.map((sale) => {
              // Custom initial color
              const nameInitial = sale.customer.charAt(0).toUpperCase();
              
              // Helper to generate initials background
              const colors = ["#2563EB", "#7C3AED", "#22C55E", "#F97316", "#EC4899"];
              const charCodeSum = sale.customer.charCodeAt(0) + (sale.customer.charCodeAt(1) || 0);
              const avatarBg = colors[charCodeSum % colors.length];

              return (
                <tr
                  key={sale.id}
                  className="hover:bg-dark/30 transition-colors"
                >
                  {/* Customer initials avatar + name */}
                  <td className="px-5 py-3 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: avatarBg }}
                    >
                      {nameInitial}
                    </div>
                    <span className="font-semibold text-text-primary truncate max-w-[120px]">
                      {sale.customer}
                    </span>
                  </td>
                  {/* Product */}
                  <td className="px-5 py-3 text-text-primary/95 truncate max-w-[130px]">
                    {sale.product}
                  </td>
                  {/* Channel icon badge */}
                  <td className="px-5 py-3">
                    <div className="inline-block scale-90">
                      <ChannelIcon channel={sale.channel} />
                    </div>
                  </td>
                  {/* Naira formatted amount */}
                  <td className="px-5 py-3 text-right font-bold text-text-primary tabular-nums">
                    ₦{sale.amount.toLocaleString()}
                  </td>
                  {/* Status Badge */}
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={sale.status} className="scale-90" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
