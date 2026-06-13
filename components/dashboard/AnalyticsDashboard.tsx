"use client";

import {
  CheckCircle2,
  RefreshCw,
  Users,
  Activity,
  Target,
  Zap,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/use-leads";
import {
  formatLabel,
  getOverdueFollowUps,
  getServiceCounts,
  getStatusCounts,
  getTodayFollowUps,
  getUpcomingFollowUps,
  sortByFollowUpDate,
} from "@/lib/lead-insights";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateTrendData, getCountsByField } from "@/lib/utils";
import { MetricCard } from "./sections/MetricCard";
import { ChartCard } from "./sections/ChartCard";
import { RECHARTS_PALETTE, STATUS_COLORS } from "@/lib/data/dashboard.color";
import { FollowUpRow } from "./sections/FollowUpRow";

// Decoupled Structural Dependencies

export default function AnalyticsDashboard() {
  const { leads, isLoading, error, refetch } = useLeads();

  // Primary Data Aggregations
  const statusCounts = getStatusCounts(leads);
  const serviceCounts = getServiceCounts(leads);
  const sourceCounts = getCountsByField(leads, "source");
  const ownerCounts = getCountsByField(leads, "assignedTo");
  const budgetCounts = getCountsByField(leads, "budget");

  // Follow-up Queue Splits
  const todayFollowUps = getTodayFollowUps(leads);
  const upcomingFollowUps = getUpcomingFollowUps(leads);
  const overdueFollowUps = getOverdueFollowUps(leads);
  const nextFollowUps = sortByFollowUpDate([...todayFollowUps, ...upcomingFollowUps]).slice(0, 5);

  // Derived Computational Matrix
  const closedCount = (statusCounts.converted || 0) + (statusCounts.qualified || 0);
  const activeCount = Math.max(leads.length - closedCount, 0);
  const assignedCount = leads.filter((lead) => Boolean(lead.assignedTo)).length;
  const conversionRate = leads.length > 0 ? Math.round((closedCount / leads.length) * 100) : 0;
  const followUpLoad = todayFollowUps.length + upcomingFollowUps.length + overdueFollowUps.length;

  // Chart Data Mapping Implementations
  const trendData = generateTrendData(leads);
  
  const statusData = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: formatLabel(status),
      value: count,
      status,
    }));

  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({
      name: formatLabel(source),
      count,
    }));

  const serviceData = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([service, count]) => ({
      name: formatLabel(service),
      count,
    }));

  const funnelData = [
    { stage: "All Leads", count: leads.length },
    { stage: "Contacted", count: statusCounts.contacted || 0 },
    { stage: "Qualified", count: statusCounts.qualified || 0 },
    { stage: "Converted", count: statusCounts.converted || 0 },
  ];

  return (
    <main className="w-full space-y-6 px-6 py-6">
      <div className="space-y-6 pr-6 max-w-full">
        {/* Core Page Heading Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Real-time insights into your lead pipeline, conversion rates, and team performance.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={refetch}
            disabled={isLoading}
            className="h-11 gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Global Pipeline Statistics Overview */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Leads"
            value={isLoading ? "..." : leads.length}
            detail="Leads in your pipeline"
            icon={Users}
            bgColor="bg-blue-500"
          />
          <MetricCard
            title="Conversion Rate"
            value={isLoading ? "..." : `${conversionRate}%`}
            detail={`${closedCount} qualified/converted`}
            trend={conversionRate > 30 ? "↑ Strong performance" : "↓ Needs improvement"}
            icon={Target}
            bgColor="bg-emerald-500"
          />
          <MetricCard
            title="Active Pipeline"
            value={isLoading ? "..." : activeCount}
            detail="Leads being worked on"
            icon={Activity}
            bgColor="bg-amber-500"
          />
          <MetricCard
            title="Follow-ups Due"
            value={isLoading ? "..." : followUpLoad}
            detail={`${overdueFollowUps.length} overdue, ${todayFollowUps.length} today`}
            trend={overdueFollowUps.length > 0 ? `⚠ ${overdueFollowUps.length} overdue` : "✓ All current"}
            icon={Zap}
            bgColor={overdueFollowUps.length > 0 ? "bg-red-500" : "bg-emerald-500"}
          />
        </div>

        {/* Analytical Visualization Core Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Lead Pipeline Trend" description="Daily leads captured and conversions">
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={500}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} name="New Leads" />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Lead Status Distribution" description="Breakdown by status">
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={400}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || RECHARTS_PALETTE[index % RECHARTS_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Leads by Source" description="Top lead sources">
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={500}>
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Service Demand" description="Breakdown by service type">
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={500}>
                <BarChart data={serviceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#ec4899" radius={[0, 8, 8, 0]} name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Conversion Lifecycle Visual Funnel */}
        <ChartCard title="Conversion Funnel" description="Lead journey through sales stages">
          <div className="space-y-4">
            {funnelData.map((item, index) => {
              const percentage = funnelData[0].count > 0 ? Math.round((item.count / funnelData[0].count) * 100) : 0;
              const funnelColors = ["bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-emerald-500"];
              return (
                <div key={item.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{item.count}</span>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full transition-all duration-300 ${funnelColors[index] || "bg-blue-500"}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Task Queue Queue List */}
        <ChartCard title="Next Follow-ups" description={`${todayFollowUps.length} today - ${upcomingFollowUps.length} upcoming`}>
          <div>
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading follow-up queue...</p>
            ) : nextFollowUps.length > 0 ? (
              nextFollowUps.map((lead) => <FollowUpRow key={lead._id || lead.phone} lead={lead} />)
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No scheduled follow-ups found.</p>
            )}
          </div>
        </ChartCard>

        {/* Operational Status Threshold Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard title="Assigned" value={isLoading ? "..." : assignedCount} detail={`${leads.length - assignedCount} leads unassigned`} icon={UserCheck} bgColor="bg-cyan-500" />
          <MetricCard title="Contacted" value={isLoading ? "..." : statusCounts.contacted || 0} detail="Leads with at least one outreach." icon={PhoneCall} bgColor="bg-orange-500" />
          <MetricCard title="Closed" value={isLoading ? "..." : closedCount} detail="Qualified or converted opportunities." icon={CheckCircle2} bgColor="bg-lime-500" />
        </div>

        {/* Bottom Metadata Categorization Vectors */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ChartCard title="Budget Ranges" description="Lead distribution by budget">
            <div className="space-y-3">
              {Object.entries(budgetCounts).sort((a, b) => b[1] - a[1]).map(([budget, count]) => (
                <div key={budget} className="flex items-center justify-between rounded-lg bg-background p-4">
                  <span className="font-medium text-foreground">{formatLabel(budget)}</span>
                  <span className="text-lg font-bold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Team Performance" description="Leads assigned per team member">
            <div className="space-y-3">
              {Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([owner, count]) => (
                <div key={owner} className="flex items-center justify-between rounded-lg bg-background p-4">
                  <span className="font-medium text-foreground capitalize">{owner}</span>
                  <span className="text-lg font-bold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Follow-up Status" description="Upcoming action items">
            <div className="space-y-3">
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-700 dark:text-red-300">Overdue</span>
                  <span className="text-lg font-bold text-red-700 dark:text-red-300">{overdueFollowUps.length}</span>
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-amber-700 dark:text-amber-300">Today</span>
                  <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{todayFollowUps.length}</span>
                </div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">Upcoming</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{upcomingFollowUps.length}</span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </main>
  );
}