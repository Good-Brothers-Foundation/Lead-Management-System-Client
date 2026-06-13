import React from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.02)] transition-shadow duration-300">
      <div className="mb-6 flex flex-col gap-1">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}