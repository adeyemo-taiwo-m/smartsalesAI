"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, User, Info, Smile, Paperclip, AlertTriangle, ChevronLeft } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChannelIcon } from "@/components/shared/ChannelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  className?: string;
}

export function ChatWindow({ className = "" }: ChatWindowProps) {
  const {
    leads,
    conversations,
    selectedLeadId,
    setSelectedLeadId,
    isAIMode,
    toggleAIMode,
    sendMessage,
  } = useStore();

  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedLead = leads.find((l) => l.id === selectedLeadId);
  const messages = selectedLeadId ? conversations[selectedLeadId] || [] : [];

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedLeadId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedLeadId) return;

    // Sender is "agent" when human takeover is active (isAIMode is false), else "ai"
    const sender = isAIMode ? "ai" : "agent";
    sendMessage(selectedLeadId, inputValue, sender);
    setInputValue("");
  };

  const getInitialsBg = (name: string) => {
    // v1.1 §7.11 avatar color utility
    const colors = ['#1D6B4A', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0F6E56', '#7C3AED', '#BE185D'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (!selectedLead) {
    return (
      <div className={cn("bg-dark-card rounded-xl border border-dark-border shadow-card flex items-center justify-center text-center p-8 h-[540px]", className)}>
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center text-text-muted mx-auto">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">No Chat Selected</h4>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            Select a live customer conversation from the list to start managing automated pipeline messages.
          </p>
        </div>
      </div>
    );
  }

  const leadInitial = selectedLead.name.charAt(0).toUpperCase();

  return (
    <div className={cn("bg-dark-card rounded-xl border border-dark-border shadow-card flex flex-col justify-between overflow-hidden h-[540px] hover:border-brand-green/30 transition-colors", className)}>
      {/* Header Info */}
      <div className="px-5 py-3 border-b border-dark-border flex items-center justify-between bg-dark/15 select-none">
        <div className="flex items-center gap-2.5">
          {/* Back button on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedLeadId(null)}
            className="lg:hidden text-text-muted hover:text-text-primary hover:bg-dark p-0 h-8 w-8 shrink-0"
          >
            <ChevronLeft size={20} />
          </Button>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
            style={{ backgroundColor: getInitialsBg(selectedLead.name) }}
          >
            {leadInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-text-primary truncate max-w-[120px] sm:max-w-none">{selectedLead.name}</h4>
              <span className="scale-85 origin-left">
                <ChannelIcon channel={selectedLead.channel} />
              </span>
            </div>
            <p className="text-[10px] text-text-muted font-medium mt-0.5 flex items-center gap-1">
              {selectedLead.phone} • <StatusBadge status={selectedLead.status} className="scale-80 origin-left" />
            </p>
          </div>
        </div>

        {/* Human Takeover Switch */}
        <div className="flex items-center gap-2 bg-dark/40 border border-dark-border rounded-full px-3 py-1.5">
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">
            {isAIMode ? "🤖 AI Mode Active" : "🧑‍💼 Human Control"}
          </span>
          <Switch
            checked={!isAIMode} // Takeover is ON when AI mode is OFF
            onCheckedChange={toggleAIMode}
            className="scale-85"
            id="human-takeover-toggle"
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-dark/10"
        ref={scrollRef}
      >
        {messages.length > 0 ? (
          messages.map((message) => {
            const isCustomer = message.sender === "customer";
            const isAi = message.sender === "ai";
            const isAgent = message.sender === "agent";

            return (
              <div
                key={message.id}
                className={cn("flex w-full", isCustomer ? "justify-start" : "justify-end")}
              >
                <div className="max-w-[75%] space-y-1">
                  {/* Sender title tags */}
                  {!isCustomer && (
                    <div className={cn("flex items-center gap-1.5 text-[9px] mb-0.5", isAi ? "justify-end text-purple-400 font-bold" : "justify-end text-text-muted font-bold")}>
                      <span>{isAi ? "🤖 Aria AI" : "🧑‍💼 Live Agent"}</span>
                      {isAi && message.intentTag && (
                        <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
                          {message.intentTag}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-lg text-xs leading-relaxed shadow-sm",
                      isCustomer
                        ? "bg-slate-700/50 text-slate-100 rounded-tl-none"
                        : isAi
                        ? "bg-gradient-to-br from-brand-green to-brand-green/70 text-white rounded-tr-none shadow-green"
                        : "bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-tr-none"
                    )}
                  >
                    <p>{message.content}</p>
                    <span
                      className={cn(
                        "block text-[8px] text-right mt-1.5 opacity-60",
                        isCustomer ? "text-slate-500" : isAi ? "text-green-100/70" : "text-slate-300"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-center p-6 select-none">
            <div>
              <p className="text-xs text-text-muted">No messages in this chat pipeline.</p>
              <p className="text-[10px] text-text-muted/70 mt-1">Send a message below to kickstart the conversation.</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Status and Input Panel */}
      <div className="border-t border-dark-border p-4 bg-dark-card space-y-2 select-none">
        {/* Dynamic status alert note */}
        <div className="flex items-center gap-1.5">
          {isAIMode ? (
            <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-medium">
              <Sparkles size={12} className="animate-spin duration-300" />
              <span>Aria is actively managing this pipeline chat automatically</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-orange-400 font-medium">
              <AlertTriangle size={12} />
              <span>You have paused AI auto-responses. Manual takeover is active.</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="text-text-muted hover:text-text-primary transition-colors shrink-0">
            <Smile size={16} />
          </button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isAIMode ? "Aria will automatically respond to customer messages..." : "Type your message as Live Agent..."}
            className="flex-1 h-9 text-xs bg-dark border-slate-700 text-slate-50 placeholder:text-slate-600 rounded-full focus:border-brand-green/60 focus:ring-2 focus:ring-brand-green/15 transition-colors duration-150"
          />
          <button type="button" className="text-text-muted hover:text-text-primary transition-colors shrink-0">
            <Paperclip size={16} />
          </button>
          <Button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              "h-8 w-8 rounded-full text-white shrink-0",
              isAIMode ? "bg-purple-600 hover:bg-purple-500" : "bg-brand-green hover:bg-brand-green/80"
            )}
            size="icon"
          >
            <Send size={12} />
          </Button>
        </form>
      </div>
    </div>
  );
}
