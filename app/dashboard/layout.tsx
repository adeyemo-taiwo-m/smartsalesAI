"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, user, login } = useStore(); // Mock login for now
  const router = useRouter();

  // Mock auto-login for development, or handle auth check
  useEffect(() => {
    if (!user) {
      // In a real app we would redirect to login
      // router.push('/login');
      // For this demo, we can just ensure a user is loaded if we want,
      // or let them stay as guest until they hit 'login'
      // login(); // optional auto-login
    }
  }, [user, login, router]);

  return (
    <div className="flex min-h-screen bg-muted/20 dark:bg-black overflow-hidden bg-gray-50">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-black/50">
          {children}
        </main>
      </div>
    </div>
  );
}
