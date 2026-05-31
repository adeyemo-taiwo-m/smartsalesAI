"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  DollarSign,
  PieChart,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, user, logout } = useStore();

  const links = [
    { href: "/dashboard",               label: "Overview",       icon: LayoutDashboard },
    { href: "/dashboard/conversations", label: "Conversations",  icon: MessageSquare   },
    { href: "/dashboard/leads",         label: "Leads",          icon: Users           },
    { href: "/dashboard/sales",         label: "Sales",          icon: DollarSign      },
    { href: "/dashboard/analytics",     label: "Analytics",      icon: PieChart        },
    { href: "/dashboard/settings",      label: "Settings",       icon: Settings        },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity duration-300",
          sidebarOpen ? "opacity-100 block" : "opacity-0 hidden"
        )}
      />

      {/* Sidebar — v1.1 §7.6 */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-dark-card border-r border-dark-border flex flex-col justify-between transition-all duration-300 ease-in-out select-none",
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:w-20 md:translate-x-0"
        )}
      >
        <div>
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-dark-border">
            <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap group">
              <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 duration-200 transition-transform shrink-0">
                <Zap size={18} className="fill-brand-green" />
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                  SmartSales AI
                </span>
              )}
            </Link>
          </div>

          {/* Nav links — v1.1 §7.6 */}
          <nav className="p-4 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative",
                    isActive
                      ? "bg-brand-green/10 text-brand-green"
                      : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50",
                    !sidebarOpen && "md:justify-center md:px-0"
                  )}
                  title={!sidebarOpen ? link.label : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  {sidebarOpen && <span>{link.label}</span>}
                  {isActive && !sidebarOpen && (
                    <div className="absolute right-1 w-1 h-6 bg-brand-green rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User card */}
        <div className="p-4 border-t border-dark-border space-y-3">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "md:justify-center")}>
            <div className="relative shrink-0">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'A'}`}
                alt={user?.name || "User Avatar"}
                className="w-10 h-10 rounded-full bg-dark-card border border-dark-border"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-card animate-pulse" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-semibold text-slate-50 truncate">{user?.name || "Admin Owner"}</h5>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Pro Plan
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors px-3 h-10 shrink-0",
              !sidebarOpen && "md:justify-center"
            )}
          >
            <LogOut size={16} />
            {sidebarOpen && <span className="ml-2.5 text-xs font-semibold">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile bottom nav — v1.1 §14.3 */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-card/90 backdrop-blur-md border-t border-dark-border flex items-center justify-around md:hidden z-40 px-2 shadow-lg">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
                isActive ? "text-brand-green" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
