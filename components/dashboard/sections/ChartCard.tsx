import React from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, action, className = "" }: ChartCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border/50">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}