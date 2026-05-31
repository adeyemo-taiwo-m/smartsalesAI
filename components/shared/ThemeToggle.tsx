"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-[88px] right-7 z-[99999] w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center opacity-40">
        <Sparkles size={18} className="text-slate-400" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-[88px] right-7 z-[99999] w-12 h-12 rounded-full bg-dark-card/90 border border-dark-border shadow-widget flex items-center justify-center text-text-primary hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md hover:border-brand-green/30 group"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 fill-amber-400/10 group-hover:rotate-45 duration-300 transition-transform" />
      ) : (
        <Moon size={18} className="text-brand-purple fill-brand-purple/10 group-hover:-rotate-12 duration-300 transition-transform" />
      )}
    </button>
  );
}

