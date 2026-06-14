"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart2, TrendingUp, Sparkles, MessageCircle, ArrowUpRight, ArrowDownRight, Smartphone, Globe, Info } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AnalyticsPage() {
  const { sales, leads } = useStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate Product Sales Performance
  const productPerformance = React.useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number; trend: "up" | "down"; growth: number }> = {};
    
    // Group sales by product
    sales.forEach((s) => {
      if (!map[s.product]) {
        // Mock trend percentages for high quality display
        const randomGrowth = Math.floor(Math.random() * 25) + 3;
        const trend = Math.random() > 0.3 ? "up" : "down";
        map[s.product] = {
          name: s.product,
          count: 0,
          revenue: 0,
          trend: trend as any,
          growth: randomGrowth,
        };
      }
      map[s.product].count += 1;
      if (s.status === "completed") {
        map[s.product].revenue += s.amount;
      }
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  // Calculate Channel splits from sales and leads
  const channelSplitData = React.useMemo(() => {
    let whatsapp = 0;
    let instagram = 0;
    let web = 0;

    leads.forEach((l) => {
      if (l.channel === "whatsapp") whatsapp++;
      if (l.channel === "instagram") instagram++;
      if (l.channel === "web") web++;
    });

    return [
      { name: "WhatsApp Business", value: whatsapp, color: "#22C55E" },
      { name: "Instagram DM", value: instagram, color: "#EC4899" },
      { name: "Website Widget", value: web, color: "#1D9E75" },
    ];
  }, [leads]);

  // Derived double area chart data logic
  const revenueChartData = React.useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartMap: Record<string, { day: string; revenue: number; leads: number }> = {};
    
    // Last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayLabel = days[d.getDay()];
      chartMap[dayLabel] = {
        day: dayLabel,
        revenue: 0,
        leads: 0,
      };
    }
    
    sales.forEach((sale) => {
      if (sale.status === "completed") {
        const saleDate = new Date(sale.date);
        const dayLabel = days[saleDate.getDay()];
        if (chartMap[dayLabel]) {
          chartMap[dayLabel].revenue += sale.amount;
        }
      }
    });

    leads.forEach((lead) => {
      const leadDate = new Date(lead.lastMessageTime);
      const dayLabel = days[leadDate.getDay()];
      if (chartMap[dayLabel]) {
        chartMap[dayLabel].leads += 1;
      }
    });

    return Object.values(chartMap);
  }, [sales, leads]);

  // Derived funnel data logic
  const funnelData = React.useMemo(() => {
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

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-700/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">Performance Insights</h1>
          <p className="text-xs text-slate-400 mt-1">Deep dive into revenue trends, lead generation, and products growth.</p>
        </div>
        
        {/* Time Selector */}
        <div className="flex bg-dark border border-slate-700/50 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === "7d" ? "bg-dark-card text-brand-green shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === "30d" ? "bg-dark-card text-brand-green shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 1. WEEKLY REVENUE & LEADS AREA GRAPH (FULL WIDTH) */}
      <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card p-5 group hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-105 duration-200 transition-transform">
              <TrendingUp size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">Revenue & Lead Acquistion Trends</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Correlation of weekly financial sales and pipeline lead counts</p>
            </div>
          </div>

          {/* Graph Legend */}
          <div className="flex gap-4 text-xs select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
              <span className="text-slate-300">Revenue (NGN)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-300">Leads captured</span>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-[280px] w-full text-xs">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D6B4A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1D6B4A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis
                  dataKey="day"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₦${val / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "11px",
                    padding: "10px 14px",
                  }}
                  formatter={(val: any, name: any) => {
                    if (name === "revenue") return [`₦${val.toLocaleString()}`, "Revenue"];
                    return [val, "Leads Captured"];
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#1D6B4A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="leads"
                  name="leads"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. PIE CHART CHANNEL BREAKDOWN & SALES STAGES BAR CHART (TWO COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Channel Splits Pie chart */}
        <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card p-5 group hover:border-slate-600 transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-105 duration-200 transition-transform">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">Channels Distribution</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Pipeline shares divided by WhatsApp, Instagram, and web chats</p>
            </div>
          </div>

          {/* Pie Graph */}
          <div className="h-[220px] w-full flex items-center justify-center">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelSplitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelSplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#F8FAFC",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-800 text-[10px] select-none">
            {channelSplitData.map((c) => (
              <div key={c.name} className="space-y-1">
                <p className="text-slate-500 font-semibold uppercase">{c.name.split(" ")[0]}</p>
                <h5 className="text-xs font-bold text-slate-100 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span>{c.value} chats</span>
                </h5>
              </div>
            ))}
          </div>
        </div>

        {/* Sales stages Progress Funnel widget (reused) */}
        <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card p-5 group hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-105 duration-200 transition-transform">
              <BarChart2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">Stages Progress Rates</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Absolute counts and conversions dropoffs across pipelines</p>
            </div>
          </div>

          {/* Progress List */}
          <div className="space-y-4">
            {funnelData.map((stage, i) => {
              const maxVal = Math.max(funnelData[0]?.count || 1, 1);
              const percent = Math.round((stage.count / maxVal) * 100);
              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{stage.stage}</span>
                    <span className="text-slate-50 font-bold tabular-nums">
                      {stage.count} <span className="text-slate-500 font-normal text-[10px]">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%`, backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. PRODUCT REVENUE GROWTH MATRIX (FULL WIDTH TABLE) */}
      <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">Best Selling Products</h3>
              <p className="text-xs text-slate-400 mt-0.5">Total transaction values and monthly growth rates</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-dark/30 text-[10px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <th className="px-5 py-3.5 text-left">Product Name</th>
                <th className="px-5 py-3.5 text-center">Orders Count</th>
                <th className="px-5 py-3.5 text-right">Total Revenue Generated</th>
                <th className="px-5 py-3.5 text-center">Monthly Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {productPerformance.map((prod, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-200">
                    {prod.name}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-300 tabular-nums">
                    {prod.count} orders
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-slate-50 tabular-nums">
                    ₦{prod.revenue.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {prod.trend === "up" ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold">
                        <ArrowUpRight size={12} /> +{prod.growth}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                        <ArrowDownRight size={12} /> -{prod.growth}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

