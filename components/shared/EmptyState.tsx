import React from "react";
import { FolderOpen, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-dark-border rounded-xl bg-dark/20 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-text-muted mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-blue hover:-translate-y-0.5 transition-all duration-200"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
