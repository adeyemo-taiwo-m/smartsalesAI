"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocalMessage {
  id: string;
  sender: "customer" | "ai";
  content: string;
  timestamp: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: "m-init",
      sender: "ai",
      content: "👋 Hi! I'm Aria, your sales assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear unread count when widget opens
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  // Submit Lead Capture Form
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    setLeadCaptured(true);
    setMessages(prev => [
      ...prev,
      {
        id: `m-sys-${Date.now()}`,
        sender: "ai",
        content: `Thanks ${leadName}! I have connected your WhatsApp number ${leadPhone} to our catalog system. How can I help you?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Send Message
  const handleSend = (contentToSend?: string) => {
    const text = contentToSend || inputValue;
    if (!text.trim()) return;

    const newCustomerMsg: LocalMessage = {
      id: `msg-${Date.now()}`,
      sender: "customer",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newCustomerMsg]);
    if (!contentToSend) {
      setInputValue("");
    }

    // Auto AI Response Simulation
    setTimeout(() => {
      let aiReply = "I am looking up that product for you. We currently ship to all states in Nigeria! 🇳🇬";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("price") || lowerText.includes("how much") || lowerText.includes("cost")) {
        aiReply = "Our Premium Ankara bundles go for ₦35,000, and our Skincare Glow Kits are ₦27,000. Express Lekki/Lagos shipping is ₦2,500! 🛍️";
      } else if (lowerText.includes("order") || lowerText.includes("buy") || lowerText.includes("purchase")) {
        aiReply = "Wonderful! I can generate a secure payment link for your checkout. Would you like to confirm the Premium Ankara bundle? ⚡";
      } else if (lowerText.includes("agent") || lowerText.includes("human") || lowerText.includes("talk to a person")) {
        aiReply = "Sure! I have notified our sales manager, and they will take over this chat momentarily. 🧑‍💼";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          content: aiReply,
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 1500);
  };

  const handleQuickReply = (replyText: string) => {
    handleSend(replyText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Toggle Bubble */}
      <button
        onClick={handleToggle}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-widget text-white hover:scale-110 duration-200 transition-transform relative focus:outline-none"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} className="fill-white/10" />}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Chat Widget Panel */}
      {isOpen && (
        <div className="absolute bottom-18 right-0 w-80 sm:w-85 h-[480px] bg-dark-card border border-slate-700/50 rounded-2xl shadow-widget flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Sparkles size={16} className="fill-white/20 text-purple-200 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wide">Aria • Sales AI</h4>
                <span className="flex items-center gap-1 text-[9px] text-green-300 font-semibold uppercase tracking-wider mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-green-300 animate-pulse" /> Online
                </span>
              </div>
            </div>
            <button onClick={handleToggle} className="text-white/60 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-between bg-dark/40 overflow-hidden">
            {/* Scrollable messages or Lead Capture */}
            {!leadCaptured ? (
              /* Lead Capture Form */
              <form onSubmit={handleLeadSubmit} className="flex-1 p-5 flex flex-col justify-center gap-4 text-left">
                <div className="text-center space-y-1.5 mb-2">
                  <h5 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Connect with Aria</h5>
                  <p className="text-[11px] text-slate-400">Please provide your details to access active pricing catalogs.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <Input
                    required
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="Chinelo Obi"
                    className="h-9 text-xs bg-dark-card border-slate-700 text-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Phone</label>
                  <Input
                    required
                    type="tel"
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="h-9 text-xs bg-dark-card border-slate-700 text-slate-200 rounded-lg"
                  />
                </div>
                <Button type="submit" className="w-full h-9 mt-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-blue">
                  Start Chat
                </Button>
              </form>
            ) : (
              /* Active Chat Area */
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Messages scroll zone */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5" ref={scrollRef}>
                  {messages.map((msg, index) => {
                    const isAi = msg.sender === "ai";
                    return (
                      <div key={msg.id || index} className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[80%] px-3.5 py-2.5 rounded-lg text-xs leading-relaxed ${
                            isAi
                              ? "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/30"
                              : "bg-blue-600 text-white rounded-tr-none shadow-blue"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className={`block text-[9px] text-right mt-1.5 opacity-60 ${!isAi && "text-blue-200"}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Reply Actions Pills */}
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {["View Prices 🏷️", "Order Items 🛍️", "Talk to Agent 🧑‍💼"].map(btn => (
                    <button
                      key={btn}
                      onClick={() => handleQuickReply(btn)}
                      className="px-2.5 py-1 text-[10px] font-medium bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-full transition-colors active:scale-95 duration-100"
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                {/* Bottom Input Area */}
                <div className="border-t border-slate-700/40 p-3 bg-dark-card flex items-center gap-2">
                  <button className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                    <Smile size={16} />
                  </button>
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="Type a message to Aria..."
                    className="flex-1 h-8 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500"
                  />
                  <button className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                    <Paperclip size={16} />
                  </button>
                  <Button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim()}
                    className="h-8 w-8 rounded-full bg-blue-600 text-white shrink-0"
                    size="icon"
                  >
                    <Send size={12} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
