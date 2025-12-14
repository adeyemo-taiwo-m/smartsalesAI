"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Since we are mocking and avoiding heavy dependencies if possible,
// using Radix UI would require installing it.
// The prompt said "Tailwind CSS", "React 18", "Next.js 14".
// It didn't forbid Headless UI or Radix but I didn't install them.
// I will build a simple accessible Tabs component manually or use a simple state-based approached if avoiding deps.
// Actually, I can just build a simple one.

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: any) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  const handleValueChange = (val: string) => {
    setActiveTab(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider
      value={{ value: activeTab, onValueChange: handleValueChange }}
    >
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }: any) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, className, children }: any) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-background text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children }: any) {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
