interface MetricCardProps {
  title: string;
  value: string | number;
  detail: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor?: string;
}

export function MetricCard({
  title,
  value,
  detail,
  trend,
  icon: Icon,
  bgColor = "bg-blue-500",
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
          {trend && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              {trend}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor} text-white`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}