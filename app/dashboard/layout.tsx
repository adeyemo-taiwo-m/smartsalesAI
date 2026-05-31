"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, leads, sendMessage } = useStore();

  // Simulated Customer Message Influx Triggers
  useEffect(() => {
    const customerQuotes = [
      { name: "Chinelo Obi", msg: "Can you confirm if you received my payment transfer? 💳" },
      { name: "Babajide Alao", msg: "I want to purchase the standard Ankara bundle. Any discounts? 🏷️" },
      { name: "Yetunde Sowemimo", msg: "Do you have the organic shea butter kits in stock today? 🧴" },
      { name: "Kelechi Nnamdi", msg: "Can I do a pickup at your Lekki phase 1 showroom? 🚚" },
      { name: "Bisi Akande", msg: "Are there other color designs for the bridal set? 🎨" }
    ];

    const interval = setInterval(() => {
      // Pick a random customer quote
      const quote = customerQuotes[Math.floor(Math.random() * customerQuotes.length)];
      
      // Find matching lead in store
      const matchingLead = leads.find(l => l.name === quote.name);
      if (matchingLead) {
        // Send message in store (which automatically dispatches HSL Toasts when appropriate!)
        sendMessage(matchingLead.id, quote.msg, "customer");
      }
    }, 28000); // Inject new message every 28 seconds

    return () => clearInterval(interval);
  }, [leads, sendMessage]);

  return (
    <div className="flex min-h-screen bg-dark overflow-hidden selection:bg-brand-green/30 select-none text-text-primary">
      {/* Dashboard sidebar navigation pane */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out pb-16 md:pb-0",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-dark/40">
          {children}
        </main>
      </div>
    </div>
  );
}
