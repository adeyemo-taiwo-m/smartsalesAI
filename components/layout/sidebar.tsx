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
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, logout } = useStore();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/conversations",
      label: "Conversations",
      icon: MessageSquare,
    },
    { href: "/dashboard/leads", label: "Leads", icon: Users },
    { href: "/dashboard/sales", label: "Sales", icon: DollarSign },
    { href: "/dashboard/analytics", label: "Analytics", icon: PieChart },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white dark:bg-zinc-950 border-r border-border transition-all duration-300 ease-in-out font-sans",
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:w-20 md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 font-bold text-xl text-primary overflow-hidden whitespace-nowrap",
              !sidebarOpen && "md:hidden"
            )}
          >
            <span>SmartSales AI</span>
          </Link>
          <div
            className={cn(
              "hidden md:flex items-center justify-center w-full",
              sidebarOpen && "hidden"
            )}
          >
            <span className="text-primary font-bold text-xl">S</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2 p-4 h-[calc(100vh-4rem)] justify-between">
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !sidebarOpen && "justify-center px-0 md:px-2"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "whitespace-nowrap transition-opacity",
                        !sidebarOpen && "md:hidden"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-border pt-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                !sidebarOpen && "justify-center"
              )}
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "ml-2 whitespace-nowrap",
                  !sidebarOpen && "md:hidden"
                )}
              >
                Logout
              </span>
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}
