"use client";

import React from "react";
import { MessageSquare, Users, CheckCircle, TrendingUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatCard } from "@/components/shared/StatCard";

export function StatsCards() {
  const { stats } = useStore();

  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
      {/* Chats: brand-green per §7.8 */}
      <StatCard label="Total Chats Today"   value={stats.totalChatsToday}    change={stats.chatsChange}   icon={MessageSquare} variant="green"  />
      {/* Leads: purple per §7.8 */}
      <StatCard label="New Leads"           value={stats.newLeads}           change={stats.leadsChange}   icon={Users}         variant="purple" />
      {/* Sales: lime green per §7.8 */}
      <StatCard label="Sales Closed"        value={stats.salesClosed}        change={stats.salesChange}   icon={CheckCircle}   variant="lime"   />
      {/* Revenue: orange per §7.8 */}
      <StatCard label="Revenue Generated"   value={stats.revenueGenerated}   change={stats.revenueChange} icon={TrendingUp}    variant="orange" isCurrency />
    </div>
  );
}
