"use client";

import { useParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/use-leads";
import { filterTasksByRoute, getLeadTasks, LeadTask } from "@/lib/task-insights";
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

function TaskStat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
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

function TaskRow({ task }: { task: LeadTask }) {
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

export default function TasksDashboard() {
  const params = useParams();
  const currentItem = Array.isArray(params?.items)
    ? params.items[0]
    : params?.items || "all";
  const { leads, isLoading, error, refetch } = useLeads();
  const tasks = getLeadTasks(leads);
  const visibleTasks = filterTasksByRoute(tasks, currentItem);
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const highPriorityCount = tasks.filter((task) => task.priority === "high").length;

  return (
    <main className="w-full space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize tracking-tight text-foreground">
            {formatLabel(currentItem)} Tasks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Work queue generated from lead follow-ups, ownership gaps, and closed records.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={refetch}
          disabled={isLoading}
          className="h-10 gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TaskStat title="All Tasks" value={isLoading ? "..." : tasks.length} icon={ClipboardList} />
        <TaskStat title="Pending" value={isLoading ? "..." : pendingCount} icon={Clock} />
        <TaskStat title="Completed" value={isLoading ? "..." : completedCount} icon={CheckCircle2} />
        <TaskStat title="High Priority" value={isLoading ? "..." : highPriorityCount} icon={AlertCircle} />
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Task List
          </h2>
          <Badge variant="outline">{visibleTasks.length} shown</Badge>
        </div>
        <div className="mt-4">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading task queue...
            </p>
          ) : visibleTasks.length > 0 ? (
            visibleTasks.map((task) => <TaskRow key={task.id} task={task} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No tasks found for this view.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
