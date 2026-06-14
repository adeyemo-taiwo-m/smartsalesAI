"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { getSocket } from "@/lib/socket";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    sidebarOpen,
    user,
    loadInitialData,
    handleSocketNewMessage,
    handleSocketLeadUpdated,
    handleSocketStatsUpdated,
  } = useStore();

  // Protect dashboard routes
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Handle Backend integration and WebSocket subscriptions
  useEffect(() => {
    if (!user) return;

    // Load initial leads, sales & stats on mount
    loadInitialData();

    // Connect socket client
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    // Register event listeners
    socket.on("new_message", handleSocketNewMessage);
    socket.on("lead_updated", handleSocketLeadUpdated);
    socket.on("stats_updated", handleSocketStatsUpdated);

    // Clean up event listeners on unmount
    return () => {
      socket.off("new_message", handleSocketNewMessage);
      socket.off("lead_updated", handleSocketLeadUpdated);
      socket.off("stats_updated", handleSocketStatsUpdated);
    };
  }, [
    user,
    loadInitialData,
    handleSocketNewMessage,
    handleSocketLeadUpdated,
    handleSocketStatsUpdated,
  ]);

  if (!user) {
    return (
      <div className="flex min-h-screen bg-dark items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-green/30 border-t-brand-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-dark overflow-hidden selection:bg-brand-green/30 select-none text-text-primary">
      {/* Dashboard sidebar navigation pane */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out pb-20 md:pb-0",
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
