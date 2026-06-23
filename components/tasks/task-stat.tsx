import { LucideIcon } from "lucide-react";

interface TaskStatProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

export function TaskStat({ title, value, icon: Icon }: TaskStatProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}