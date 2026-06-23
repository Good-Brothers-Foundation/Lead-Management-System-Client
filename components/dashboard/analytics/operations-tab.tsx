"use client";

import { UserCheck, PhoneCall, CheckCircle2 } from "lucide-react";
import { MetricCard } from "../sections/MetricCard";
import { ChartCard } from "../sections/ChartCard";
import { formatLabel } from "@/lib/lead-insights";
import { Badge } from "@/components/ui/badge";
import { TeamTask } from "@/lib/types/team";

interface OperationsTabProps {
  totalLeads: number;
  assignedCount: number;
  contactedCount: number;
  closedCount: number;
  budgetCounts: Record<string, number>;
  ownerCounts: Record<string, number>;
  urgency: {
    overdue: number;
    today: number;
    upcoming: number;
  };
  tasks?: TeamTask[];
}

export function OperationsTab({ 
  totalLeads, 
  assignedCount, 
  contactedCount, 
  closedCount, 
  budgetCounts, 
  ownerCounts, 
  urgency,
  tasks = []
}: OperationsTabProps) {

  // Calculate task statistics per member
  const memberStats: Record<string, { total: number; completed: number; pending: number }> = {};

  tasks.forEach((task) => {
    // Ignore deleted tasks for performance calculations
    if (task.isDeleted) return;

    // Determine assignee name
    const assignee = typeof task.assignedTo === "object" && task.assignedTo ? task.assignedTo.name : "Unassigned";

    if (!memberStats[assignee]) {
      memberStats[assignee] = { total: 0, completed: 0, pending: 0 };
    }

    memberStats[assignee].total += 1;
    if (task.status === "completed") {
      memberStats[assignee].completed += 1;
    } else {
      memberStats[assignee].pending += 1;
    }
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Assigned" value={assignedCount} detail={`${totalLeads - assignedCount} leads unassigned`} icon={UserCheck} bgColor="bg-cyan-500" />
        <MetricCard title="Contacted" value={contactedCount} detail="Leads with at least one outreach" icon={PhoneCall} bgColor="bg-orange-500" />
        <MetricCard title="Closed Opportunities" value={closedCount} detail="Qualified or converted sales targets" icon={CheckCircle2} bgColor="bg-lime-500" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Budget Blocks */}
        <ChartCard title="Budget Ranges" description="Lead breakdown grouped by purchase budgets">
          <div className="space-y-3.5">
            {Object.entries(budgetCounts).length > 0 ? (
              Object.entries(budgetCounts).sort((a, b) => b[1] - a[1]).map(([budget, count]) => {
                const percent = Math.round((count / totalLeads) * 100) || 0;
                return (
                  <div key={budget} className="flex flex-col gap-2 rounded-2xl bg-muted/40 p-4 border border-border/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{formatLabel(budget)}</span>
                      <span className="text-sm font-extrabold text-foreground">{count} <span className="text-xs text-muted-foreground font-medium">({percent}%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm font-semibold text-muted-foreground">No budget values found.</p>
            )}
          </div>
        </ChartCard>

        {/* Team Performance */}
        <ChartCard title="Team Performance" description="Active leads distribution per team owner">
          <div className="space-y-3.5">
            {Object.entries(ownerCounts).length > 0 ? (
              Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([owner, count]) => {
                const percent = Math.round((count / totalLeads) * 100) || 0;
                return (
                  <div key={owner} className="flex flex-col gap-2 rounded-2xl bg-muted/40 p-4 border border-border/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground capitalize">{owner}</span>
                      <span className="text-sm font-extrabold text-foreground">{count} <span className="text-xs text-muted-foreground font-medium">({percent}%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm font-semibold text-muted-foreground">No assigned owners found.</p>
            )}
          </div>
        </ChartCard>

        {/* Urgency Vectors */}
        <ChartCard title="Follow-up Urgency" description="Current action items categorized by delay threshold">
          <div className="space-y-4">
            <div className="rounded-2xl bg-red-500/10 border border-red-500/10 p-4.5 flex items-center justify-between group hover:bg-red-500/15 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">!</div>
                <div>
                  <p className="font-bold text-sm text-foreground">Overdue</p>
                  <p className="text-xs text-muted-foreground font-medium">Requires immediate outreach</p>
                </div>
              </div>
              <span className="text-2xl font-black text-red-600">{urgency.overdue}</span>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/10 p-4.5 flex items-center justify-between group hover:bg-amber-500/15 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">T</div>
                <div>
                  <p className="font-bold text-sm text-foreground">Due Today</p>
                  <p className="text-xs text-muted-foreground font-medium">Outreach tasks scheduled for today</p>
                </div>
              </div>
              <span className="text-2xl font-black text-amber-600">{urgency.today}</span>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/10 p-4.5 flex items-center justify-between group hover:bg-emerald-500/15 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">U</div>
                <div>
                  <p className="font-bold text-sm text-foreground">Upcoming</p>
                  <p className="text-xs text-muted-foreground font-medium">Future scheduled touches</p>
                </div>
              </div>
              <span className="text-2xl font-black text-emerald-600">{urgency.upcoming}</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Member Tasks Productivity section */}
      <ChartCard title="Member Task Productivity" description="Completion rate and workload metrics per team member">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(memberStats).length > 0 ? (
            Object.entries(memberStats).map(([memberName, stats]) => {
              const completionRate = Math.round((stats.completed / stats.total) * 100) || 0;
              return (
                <div key={memberName} className="flex flex-col gap-3 rounded-2xl bg-muted/30 p-5 border border-border/80 hover:bg-muted/50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground capitalize">{memberName}</span>
                    <Badge variant="secondary" className="font-bold text-xs bg-muted/65 text-muted-foreground px-2 py-0.5 rounded-md">
                      {stats.total} Tasks
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Completed: <strong className="text-foreground font-bold">{stats.completed}</strong></span>
                    <span>Pending: <strong className="text-foreground font-bold">{stats.pending}</strong></span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Completion Rate</span>
                      <span className="font-bold text-[#fd6102]">{completionRate}%</span>
                    </div>
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-sm font-semibold text-muted-foreground">
              No tasks found. Assign tasks to team members to see performance metrics.
            </div>
          )}
        </div>
      </ChartCard>
    </div>
  );
}