import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadTask } from "@/lib/task-insights";
import { formatLabel } from "@/lib/lead-insights";

const priorityStyles: Record<LeadTask["priority"], string> = {
  high: "border-destructive/20 bg-destructive/10 text-destructive",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  low: "border-muted bg-muted text-muted-foreground",
};

const statusStyles: Record<LeadTask["status"], string> = {
  pending: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
};

interface TaskRowProps {
  task: LeadTask;
}

export function TaskRow({ task }: TaskRowProps) {
  return (
    <div className="grid gap-4 border-b border-border px-1 py-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
          <Badge variant="outline" className={priorityStyles[task.priority]}>
            {formatLabel(task.priority)}
          </Badge>
          <Badge variant="outline" className={statusStyles[task.status]}>
            {formatLabel(task.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{task.company}</span>
          <span className="inline-flex items-center gap-1">
            <UserRound className="h-3.5 w-3.5" />
            {task.owner}
          </span>
          <span>{formatLabel(task.source)}</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground md:text-right">
        <p className="font-semibold text-foreground">{task.dueDate || "No due date"}</p>
        <p>{task.dueTime || "Any time"}</p>
      </div>
    </div>
  );
}