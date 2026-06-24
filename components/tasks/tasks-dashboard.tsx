"use client";

import { useParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/use-leads";
import { filterTasksByRoute, getLeadTasks } from "@/lib/task-insights";
import { formatLabel } from "@/lib/lead-insights";
import { TaskStat } from "./task-stat";
import { TaskRow } from "./task-row";

export default function TasksDashboard() {
  const params = useParams();
  const currentItem = Array.isArray(params?.items)
    ? params.items[0]
    : params?.items || "all";
    
  const { leads, isLoading, error, refetch } = useLeads();
  
  // Data processing memoization thresholds can be added here if arrays grow large
  const tasks = getLeadTasks(leads) || [];
  const visibleTasks = filterTasksByRoute(tasks, currentItem) || [];
  
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const highPriorityCount = tasks.filter((task) => task.priority === "high").length;

  // Safe evaluation of error messaging formats
  const errorMessage = error;

  return (
    <main className="w-full space-y-6 p-6">
      {/* Header Block Container */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize tracking-tight text-foreground">
            {formatLabel(currentItem)} Tasks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Work queue generated from lead follow-ups, assignment gaps, and closed records.
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

      {/* Error Interface View */}
      {errorMessage && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Numerical Stats Summary Layout */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TaskStat title="All Tasks" value={isLoading ? "..." : tasks.length} icon={ClipboardList} />
        <TaskStat title="Pending" value={isLoading ? "..." : pendingCount} icon={Clock} />
        <TaskStat title="Completed" value={isLoading ? "..." : completedCount} icon={CheckCircle2} />
        <TaskStat title="High Priority" value={isLoading ? "..." : highPriorityCount} icon={AlertCircle} />
      </div>

      {/* Task Queue Execution View */}
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