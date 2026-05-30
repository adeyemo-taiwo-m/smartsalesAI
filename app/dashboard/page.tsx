"use client";

import React from "react";
import { Plus, HelpCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { LiveConversationsPanel } from "@/components/dashboard/LiveConversationsPanel";
import { ChatWindow } from "@/components/dashboard/ChatWindow";
import { SalesFunnelWidget } from "@/components/dashboard/SalesFunnelWidget";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Demo Warning Banner */}
      <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl py-2 px-4 flex items-center justify-between select-none">
        <p className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
          <span>SmartSales AI Demo Mode is active. Aria is online and will auto-reply in real-time.</span>
        </p>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <HelpCircle size={12} /> How it works
        </span>
      </div>

      {/* Top Page Header (Overview page) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline calculations, live chat sessions, and sales tracking.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Create new simulation context trigger */}
          <Button className="h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-blue hover:-translate-y-0.5 transition-all duration-200">
            <Plus size={14} className="mr-1.5" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards Rows */}
      <StatsCards />

      {/* Main Messaging split view grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[33%_67%] gap-6">
        <LiveConversationsPanel />
        <ChatWindow />
      </div>

      {/* Bottom Performance and Ledger grids */}
      <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-6">
        <SalesFunnelWidget />
        <RecentSalesTable />
      </div>
    </div>
  );
}
