"use client";

import React, { useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChannelIcon } from "@/components/shared/ChannelIcon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LiveConversationsPanelProps {
  className?: string;
}

export function LiveConversationsPanel({ className = "" }: LiveConversationsPanelProps) {
  const { leads, selectedLeadId, setSelectedLeadId } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Sort leads by last message time (newest first)
  const sortedLeads = [...leads].sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );

  // Filter leads based on search query
  const filteredLeads = sortedLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
  );

  const getInitialsBg = (name: string) => {
    const colors = ["#2563EB", "#7C3AED", "#22C55E", "#F97316", "#EC4899", "#0891B2"];
    const sum = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return colors[sum % colors.length];
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className={cn("bg-dark-card rounded-xl border border-slate-700/50 shadow-card flex flex-col overflow-hidden h-[540px] group hover:border-slate-600 transition-colors", className)}>
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Live Conversations</h3>
        </div>
        <span className="bg-slate-800/80 border border-slate-700/50 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-400">
          {leads.length} Active
        </span>
      </div>

      {/* Search Filter Box */}
      <div className="p-3 border-b border-slate-700/40 bg-dark/15">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active chats..."
            className="h-8 pl-8 pr-3 text-xs bg-dark border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-full focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Leads Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/30">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => {
            const isSelected = selectedLeadId === lead.id;
            const initial = lead.name.charAt(0).toUpperCase();

            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={cn(
                  "flex items-start gap-3.5 px-4 py-3.5 cursor-pointer transition-all duration-150 relative select-none",
                  isSelected
                    ? "bg-blue-600/10 border-l-3 border-l-blue-500"
                    : "hover:bg-slate-800/30 border-l-3 border-l-transparent"
                )}
              >
                {/* Initial Avatar with Pulsing Active state */}
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: getInitialsBg(lead.name) }}
                  >
                    {initial}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 scale-90">
                    <ChannelIcon channel={lead.channel} size={8} className="p-1" />
                  </div>
                </div>

                {/* Text details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-100 truncate">
                      {lead.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {formatTime(lead.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate leading-relaxed">
                    {lead.lastMessage}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <StatusBadge status={lead.status} className="scale-85 origin-left" />
                    {lead.unreadCount > 0 && (
                      <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                        {lead.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-slate-500 text-xs">
            No chats matched your search query.
          </div>
        )}
      </div>
    </div>
  );
}
