import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  detail: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor?: string;
}

const getColorClasses = (bgColor: string) => {
  switch (bgColor) {
    case "bg-blue-500":
      return "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
    case "bg-emerald-500":
      return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "bg-amber-500":
      return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
    case "bg-red-500":
      return "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400";
    case "bg-cyan-500":
      return "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400";
    case "bg-orange-500":
      return "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
    case "bg-lime-500":
      return "bg-lime-500/10 text-lime-600 dark:bg-lime-500/20 dark:text-lime-400";
    default:
      return "bg-primary/10 text-primary";
  }
};

const getTrendBadge = (trend?: string) => {
  if (!trend) return null;
  
  let colors = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/10";
  if (trend.includes("↓") || trend.includes("Needs")) {
    colors = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/10";
  } else if (trend.includes("⚠") || trend.includes("overdue") || trend.includes("overdue")) {
    colors = "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/10";
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${colors} mt-2`}>
      {trend}
    </span>
  );
};

export function MetricCard({
  title,
  value,
  detail,
  trend,
  icon: Icon,
  bgColor = "bg-blue-500",
}: MetricCardProps) {
  const iconColors = getColorClasses(bgColor);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.04)] hover:border-foreground/10 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground truncate">{detail}</p>
          {trend && <div>{getTrendBadge(trend)}</div>}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconColors}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}