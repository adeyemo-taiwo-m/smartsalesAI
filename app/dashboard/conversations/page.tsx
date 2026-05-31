"use client";

import React from "react";
import { LiveConversationsPanel } from "@/components/dashboard/LiveConversationsPanel";
import { ChatWindow } from "@/components/dashboard/ChatWindow";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function ConversationsPage() {
  const { selectedLeadId } = useStore();

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      {/* Title */}
      <div className="shrink-0 select-none">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
          Omnichannel Inbox
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor auto-responses, view intent tags, and take over customer dialogues.
        </p>
      </div>

      {/* Main Inbox Panels split */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[33%_67%] gap-6">
        <LiveConversationsPanel className={cn("h-full", selectedLeadId ? "hidden lg:flex" : "flex")} />
        <ChatWindow className={cn("h-full", selectedLeadId ? "flex" : "hidden lg:flex")} />
      </div>
    </div>
  );
}
