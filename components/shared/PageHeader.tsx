import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-700/30">
      <div>
        <h1 className="text-2xl font-bold text-slate-50 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center shrink-0">{action}</div>}
    </div>
  );
}
