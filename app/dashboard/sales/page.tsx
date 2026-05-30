"use client";

import React, { useState } from "react";
import { Download, Search, DollarSign, ShoppingCart, Percent, TrendingUp, Sparkles, Filter } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChannelIcon } from "@/components/shared/ChannelIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Channel } from "@/lib/types";

export default function SalesPage() {
  const { sales } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"all" | Channel>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "pending" | "refunded">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter Sales
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === "all" || sale.channel === selectedChannel;
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Financial calculations
  const completedSales = sales.filter((s) => s.status === "completed");
  const totalRevenue = completedSales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSalesCount = completedSales.length;
  const avgOrderValue = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;

  const refundedSales = sales.filter((s) => s.status === "refunded");
  const refundRate = sales.length > 0 ? Math.round((refundedSales.length / sales.length) * 100) : 0;

  // Simulate CSV Export
  const handleExportCSV = () => {
    const headers = "Transaction ID,Customer,Product,Amount (NGN),Channel,Status,Date\n";
    const rows = filteredSales
      .map(
        (s) =>
          `"${s.id}","${s.customer}","${s.product}",${s.amount},"${s.channel}","${s.status}","${new Date(
            s.date
          ).toLocaleDateString()}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `smartsales_ledger_${Date.now()}.csv`);
    a.click();
  };

  const getInitialsBg = (name: string) => {
    const colors = ["#2563EB", "#7C3AED", "#22C55E", "#F97316", "#EC4899", "#0891B2"];
    const sum = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return colors[sum % colors.length];
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-700/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">Sales Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Track customer payments, wholesale margins, and export CSV logs.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          className="h-9 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/50 rounded-lg shadow-sm shrink-0"
        >
          <Download size={14} className="mr-1.5" /> Export CSV Report
        </Button>
      </div>

      {/* TOP MINI SALES KPIS ROWS */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {/* KPI: Total Sales */}
        <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 flex items-center justify-between shadow-card hover:border-blue-500/20 duration-200 transition-colors group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Orders</p>
            <h4 className="text-xl font-bold text-slate-50 tabular-nums">{totalSalesCount}</h4>
            <p className="text-[9px] text-green-400 font-semibold flex items-center mt-1">
              <TrendingUp size={10} className="mr-0.5" /> +8% vs last month
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 duration-200 transition-transform">
            <ShoppingCart size={16} />
          </div>
        </div>

        {/* KPI: Total Revenue */}
        <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 flex items-center justify-between shadow-card hover:border-blue-500/20 duration-200 transition-colors group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
            <h4 className="text-xl font-bold text-slate-50 tabular-nums">₦{totalRevenue.toLocaleString()}</h4>
            <p className="text-[9px] text-green-400 font-semibold flex items-center mt-1">
              <TrendingUp size={10} className="mr-0.5" /> +14% vs last month
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 group-hover:scale-105 duration-200 transition-transform">
            <DollarSign size={16} />
          </div>
        </div>

        {/* KPI: Average Order Value */}
        <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 flex items-center justify-between shadow-card hover:border-blue-500/20 duration-200 transition-colors group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Order Value</p>
            <h4 className="text-xl font-bold text-slate-50 tabular-nums">₦{avgOrderValue.toLocaleString()}</h4>
            <p className="text-[9px] text-green-400 font-semibold flex items-center mt-1">
              <TrendingUp size={10} className="mr-0.5" /> +4% vs last month
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 group-hover:scale-105 duration-200 transition-transform">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* KPI: Refund Rate */}
        <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 flex items-center justify-between shadow-card hover:border-blue-500/20 duration-200 transition-colors group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Refund Rate</p>
            <h4 className="text-xl font-bold text-slate-50 tabular-nums">{refundRate}%</h4>
            <p className="text-[9px] text-slate-500 font-semibold flex items-center mt-1">
              Stable trend flow
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 duration-200 transition-transform">
            <Percent size={16} />
          </div>
        </div>
      </div>

      {/* FILTER CONTROLLERS BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-dark-card border border-slate-700/50 rounded-xl p-4 select-none">
        {/* Search Input */}
        <div className="relative w-full md:max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, item..."
            className="h-8.5 pl-8.5 bg-dark border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500 text-xs"
          />
        </div>

        {/* Filter options selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5 bg-dark border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-500">Channel:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value as any)}
              className="bg-transparent text-slate-300 font-semibold focus:outline-none text-xs"
            >
              <option value="all" className="bg-[#1E293B]">All Channels</option>
              <option value="whatsapp" className="bg-[#1E293B]">WhatsApp</option>
              <option value="instagram" className="bg-[#1E293B]">Instagram</option>
              <option value="web" className="bg-[#1E293B]">Web widget</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-dark border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-500">Payment Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-slate-300 font-semibold focus:outline-none text-xs"
            >
              <option value="all" className="bg-[#1E293B]">All Statuses</option>
              <option value="completed" className="bg-[#1E293B]">Completed</option>
              <option value="pending" className="bg-[#1E293B]">Pending</option>
              <option value="refunded" className="bg-[#1E293B]">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* SALES LEDGER DATATABLE */}
      <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-dark/30 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 text-left">Transaction ID</th>
                <th className="px-5 py-3.5 text-left">Customer</th>
                <th className="px-5 py-3.5 text-left">Product Item</th>
                <th className="px-5 py-3.5 text-left">Source Channel</th>
                <th className="px-5 py-3.5 text-left">Date</th>
                <th className="px-5 py-3.5 text-right">Amount (NGN)</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {paginatedSales.length > 0 ? (
                paginatedSales.map((sale) => {
                  const initials = sale.customer.charAt(0).toUpperCase();

                  return (
                    <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Trans ID */}
                      <td className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wide">
                        {sale.id}
                      </td>
                      {/* Customer info */}
                      <td className="px-5 py-3 flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: getInitialsBg(sale.customer) }}
                        >
                          {initials}
                        </div>
                        <span className="font-semibold text-slate-200 truncate">
                          {sale.customer}
                        </span>
                      </td>
                      {/* Product */}
                      <td className="px-5 py-3 text-slate-300">
                        {sale.product}
                      </td>
                      {/* Source Channel icon pill */}
                      <td className="px-5 py-3">
                        <div className="inline-block scale-90">
                          <ChannelIcon channel={sale.channel} />
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-5 py-3 text-slate-400">
                        {new Date(sale.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      {/* Naira formatted amount */}
                      <td className="px-5 py-3 text-right font-extrabold text-slate-50 tabular-nums">
                        ₦{sale.amount.toLocaleString()}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3 text-center">
                        <StatusBadge status={sale.status} className="scale-90" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-slate-500 italic">
                    No transactions matched your filtering options.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION COMPONENT FOOTER */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-700/50 bg-dark/20 flex items-center justify-between text-xs select-none">
            <span className="text-slate-500">
              Showing page <strong className="text-slate-300 font-semibold">{currentPage}</strong> of{" "}
              <strong className="text-slate-300 font-semibold">{totalPages}</strong>
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                className="h-8 text-[10px] font-semibold border-slate-700 text-slate-300 hover:text-white"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                className="h-8 text-[10px] font-semibold border-slate-700 text-slate-300 hover:text-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
