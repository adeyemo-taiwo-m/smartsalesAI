"use client";

import { useStore } from "@/store/useStore";
import { Bell, Menu, Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Topbar() {
  const { user, toggleSidebar, leads } = useStore();
  const pathname = usePathname();

  // Get dynamic title based on active route
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return { title: "Overview", bread: "Dashboard / Home" };
      case "/dashboard/conversations":
        return { title: "Conversations", bread: "Dashboard / Inbox" };
      case "/dashboard/leads":
        return { title: "Leads Pipeline", bread: "CRM / Leads" };
      case "/dashboard/sales":
        return { title: "Sales Ledger", bread: "Finance / Sales" };
      case "/dashboard/analytics":
        return { title: "Performance Insights", bread: "Analytics / Metrics" };
      case "/dashboard/settings":
        return { title: "System Settings", bread: "Configuration / Settings" };
      default:
        return { title: "Dashboard", bread: "Dashboard" };
    }
  };

  const pageTitle = getPageTitle();
  const totalUnreadCount = leads.reduce((acc, lead) => acc + lead.unreadCount, 0);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-dark-border bg-dark-card/85 px-4 backdrop-blur-md md:px-6">
      {/* Left side: Mobile Toggle & Page Titles */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden text-text-muted hover:text-text-primary hover:bg-dark/40"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium hidden sm:block">
            {pageTitle.bread}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight leading-tight">
            {pageTitle.title}
          </h2>
        </div>
      </div>

      {/* Right side: Search, Notifications, Store, User Info */}
      <div className="flex items-center gap-4">
        {/* Search Field (Hidden on small mobile) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          <Input
            type="search"
            placeholder="Search leads, payments..."
            className="w-60 pl-9 rounded-full bg-dark border-slate-700 text-slate-50 placeholder:text-slate-600 text-xs py-1 focus:border-brand-green/60 focus:ring-2 focus:ring-brand-green/15 transition-colors duration-150"
          />
        </div>

        {/* Business Store indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-dark/40 border border-dark-border rounded-full px-3 py-1.5 text-xs text-text-primary">
          <Store size={14} className="text-brand-green" />
          <span className="font-semibold text-text-primary">Kene Fashion Hub</span>
        </div>

        {/* Notifications Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-text-muted hover:text-text-primary hover:bg-dark rounded-full shrink-0"
        >
          <Bell className="h-4.5 w-4.5" />
          {totalUnreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </Button>

        {/* Dynamic User Profile Header */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-dark-border shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-text-primary">{user?.name || "Admin Manager"}</p>
            <p className="text-[10px] text-text-muted font-medium capitalize mt-0.5">
              {user?.role || "Owner"}
            </p>
          </div>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'A'}`}
            alt={user?.name || "Avatar"}
            className="w-8 h-8 rounded-full border border-dark-border bg-dark-card shrink-0 ring-2 ring-transparent hover:ring-brand-green/20 duration-200 transition-all cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
