"use client";

import { useStore } from "@/store/useStore";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/theme-toggle"; // Assuming you may need cn later, or remove if unused

export function Topbar() {
  const { user, toggleSidebar } = useStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur dark:bg-zinc-950/80 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center gap-2 text-muted-foreground">
          <span className="font-semibold text-foreground">My Business</span>
          <span>/</span>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-9 rounded-full bg-muted/50 focus-visible:bg-background"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <ModeToggle />

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name || "Guest User"}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role || "Visitor"}
            </p>
          </div>
          <Avatar
            src={user?.avatar}
            fallback={user?.name?.charAt(0) || "U"}
            className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/20"
          />
        </div>
      </div>
    </header>
  );
}
