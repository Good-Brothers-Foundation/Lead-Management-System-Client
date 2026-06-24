import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  detail: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export function MetricCard({ title, value, detail, trend, icon: Icon, accentColor }: MetricCardProps) {
  const getTrendStyle = () => {
    if (!trend) return null;
    if (trend.includes("↓") || trend.includes("⚠") || trend.includes("overdue") || trend.includes("Needs")) {
      return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400";
    }
    if (trend.includes("✓") || trend.includes("↑") || trend.includes("Strong")) {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    }
    return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
  };

  return (
    <div
      className="relative rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:scale-[1.015] transition-all duration-300 overflow-hidden flex flex-col"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Subtle glow background */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Value */}
        <p className="text-4xl font-extrabold tracking-tight text-foreground leading-none">{value}</p>

        {/* Detail */}
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{detail}</p>

        {/* Trend badge */}
        {trend && (
          <span className={`self-start inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getTrendStyle()}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
    </div>
  );
}