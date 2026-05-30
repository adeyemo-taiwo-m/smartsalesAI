"use client";

import React, { useState } from "react";
import { Plus, Search, Kanban, List, Filter, Trash2, Calendar, Phone, ArrowRightLeft, Sparkles, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChannelIcon } from "@/components/shared/ChannelIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Channel, LeadStatus, Lead, IntentTag } from "@/lib/types";

export default function LeadsPage() {
  const { leads, addLead, updateLeadStatus, setSelectedLeadId } = useStore();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"all" | Channel>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | LeadStatus>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadChannel, setNewLeadChannel] = useState<Channel>("whatsapp");
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus>("new");
  const [newLeadIntent, setNewLeadIntent] = useState<IntentTag>("Inquiry");

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesChannel = selectedChannel === "all" || lead.channel === selectedChannel;
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Handle Form Submit
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    addLead({
      name: newLeadName,
      phone: newLeadPhone,
      channel: newLeadChannel,
      status: newLeadStatus,
      intentTags: [newLeadIntent],
    });

    // Reset Form & Close Modal
    setNewLeadName("");
    setNewLeadPhone("");
    setNewLeadChannel("whatsapp");
    setNewLeadStatus("new");
    setNewLeadIntent("Inquiry");
    setIsModalOpen(false);
  };

  const kanbanColumns: { id: LeadStatus; label: string; color: string; bg: string }[] = [
    { id: "new", label: "New Leads", color: "text-blue-400 border-blue-500/20", bg: "bg-blue-500/5" },
    { id: "warm", label: "Interested / Warm", color: "text-orange-400 border-orange-500/20", bg: "bg-orange-500/5" },
    { id: "hot", label: "Negotiating / Hot", color: "text-red-400 border-red-500/20", bg: "bg-red-500/5" },
    { id: "closed", label: "Converted / Closed", color: "text-green-400 border-green-500/20", bg: "bg-green-500/5" },
  ];

  const getInitialsBg = (name: string) => {
    const colors = ["#2563EB", "#7C3AED", "#22C55E", "#F97316", "#EC4899", "#0891B2"];
    const sum = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return colors[sum % colors.length];
  };

  const getNextStatus = (current: LeadStatus): LeadStatus => {
    switch (current) {
      case "new": return "warm";
      case "warm": return "hot";
      case "hot": return "closed";
      default: return "new";
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Title zone */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-700/30 select-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">Leads Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">Qualify chats, update pipelines stages, and close Nigerian SME shoppers.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle Kanban/Table */}
          <div className="flex bg-dark border border-slate-700/50 rounded-xl p-1 shrink-0 mr-1.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "kanban" ? "bg-dark-card text-blue-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Kanban size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "table" ? "bg-dark-card text-blue-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List size={14} /> List View
            </button>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-9 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-blue hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={15} className="mr-1.5" /> Add Lead
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-dark-card border border-slate-700/50 rounded-xl p-4 select-none">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or number..."
            className="h-8.5 pl-8.5 bg-dark border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500 text-xs"
          />
        </div>

        {/* Dropdown Filters */}
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
            <span className="text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-slate-300 font-semibold focus:outline-none text-xs"
            >
              <option value="all" className="bg-[#1E293B]">All Stages</option>
              <option value="new" className="bg-[#1E293B]">New</option>
              <option value="warm" className="bg-[#1E293B]">Warm</option>
              <option value="hot" className="bg-[#1E293B]">Hot</option>
              <option value="closed" className="bg-[#1E293B]">Closed</option>
              <option value="lost" className="bg-[#1E293B]">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD STAGE VIEW */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none items-start">
          {kanbanColumns.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.id);

            return (
              <div
                key={col.id}
                className={`rounded-xl border border-slate-700/40 p-4 min-h-[400px] flex flex-col space-y-4 ${col.bg}`}
              >
                {/* Column Title */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-400">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
                  {colLeads.length > 0 ? (
                    colLeads.map((lead) => {
                      const avatarInitials = lead.name.charAt(0).toUpperCase();

                      return (
                        <div
                          key={lead.id}
                          className="bg-dark-card border border-slate-700/50 rounded-xl p-4 shadow-card hover:border-slate-500 duration-200 transition-colors space-y-3 group relative"
                        >
                          {/* Card Header: Initials, Channel, Name */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0"
                                style={{ backgroundColor: getInitialsBg(lead.name) }}
                              >
                                {avatarInitials}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-100 truncate max-w-[120px]">
                                  {lead.name}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1.5 mt-0.5">
                                  <Phone size={10} /> {lead.phone}
                                </p>
                              </div>
                            </div>
                            <span className="scale-85 shrink-0">
                              <ChannelIcon channel={lead.channel} />
                            </span>
                          </div>

                          {/* Last preview message */}
                          <p className="text-[11px] text-slate-400 leading-relaxed truncate mt-1">
                            "{lead.lastMessage}"
                          </p>

                          {/* Intent Tag row */}
                          <div className="flex flex-wrap gap-1">
                            {lead.intentTags?.map((tag) => (
                              <span
                                key={tag}
                                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Interactive Move & Actions Bar */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] select-none">
                            <button
                              onClick={() => {
                                const nextStat = getNextStatus(lead.status);
                                updateLeadStatus(lead.id, nextStat);
                              }}
                              className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ArrowRightLeft size={11} />
                              <span>Move to {getNextStatus(lead.status).toUpperCase()}</span>
                            </button>

                            {/* Option to open inbox directly */}
                            <Link
                              href="/dashboard/conversations"
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="font-bold text-slate-500 hover:text-slate-200 transition-colors"
                            >
                              Open Inbox
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center text-slate-600 text-xs italic">
                      No cards in this stage.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST STYLED VIEW */
        <div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card overflow-hidden select-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-dark/30 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-left">Customer</th>
                  <th className="px-5 py-3.5 text-left">Channel</th>
                  <th className="px-5 py-3.5 text-left">Pipeline Stage</th>
                  <th className="px-5 py-3.5 text-left">Last Message Preview</th>
                  <th className="px-5 py-3.5 text-left">Intents Qualifiers</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const avatarInit = lead.name.charAt(0).toUpperCase();

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3 flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                            style={{ backgroundColor: getInitialsBg(lead.name) }}
                          >
                            {avatarInit}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200 truncate block">
                              {lead.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{lead.phone}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="inline-block scale-90">
                            <ChannelIcon channel={lead.channel} />
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={lead.status} className="scale-90" />
                        </td>
                        <td className="px-5 py-3 text-slate-400 truncate max-w-[200px]">
                          {lead.lastMessage}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {lead.intentTags?.map((tag) => (
                              <span
                                key={tag}
                                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider scale-90 origin-left"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href="/dashboard/conversations"
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors px-2 py-1 rounded bg-blue-500/10"
                            >
                              Chat Inbox
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-500 italic">
                      No leads matched your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD LEAD OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm select-none animate-in fade-in duration-200">
          <div className="bg-dark-card border border-slate-700/50 rounded-xl shadow-widget max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between bg-dark/20">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Add New Lead</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddLeadSubmit} className="p-5 space-y-4">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</label>
                <Input
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Chinelo Obi"
                  className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone number</label>
                <Input
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                />
              </div>

              {/* Channel & Stage split */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source Channel</label>
                  <select
                    value={newLeadChannel}
                    onChange={(e) => setNewLeadChannel(e.target.value as any)}
                    className="w-full h-9.5 px-3 bg-dark border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram DM</option>
                    <option value="web">Web Chatbot</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pipeline Stage</label>
                  <select
                    value={newLeadStatus}
                    onChange={(e) => setNewLeadStatus(e.target.value as any)}
                    className="w-full h-9.5 px-3 bg-dark border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="warm">Warm / Interested</option>
                    <option value="hot">Hot / Negotiating</option>
                    <option value="closed">Closed / Converted</option>
                  </select>
                </div>
              </div>

              {/* Intent Qualifier */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Intents Tag</label>
                <select
                  value={newLeadIntent}
                  onChange={(e) => setNewLeadIntent(e.target.value as any)}
                  className="w-full h-9.5 px-3 bg-dark border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Inquiry">General Inquiry</option>
                  <option value="Pricing">Pricing Question</option>
                  <option value="Buying">Ordering / Buying Intent</option>
                  <option value="Support">Customer Support</option>
                  <option value="Complaint">Customer Complaint</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 h-9 text-xs border-slate-700 text-slate-300 hover:bg-slate-800/40 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 h-9 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-blue"
                >
                  Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
