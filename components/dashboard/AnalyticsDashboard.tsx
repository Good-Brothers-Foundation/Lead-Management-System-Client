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
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/use-leads";
import {
  formatLabel,
  getOverdueFollowUps,
  getServiceCounts,
  getStatusCounts,
  getTodayFollowUps,
  getUpcomingFollowUps,
  normalizeStatus,
  sortByFollowUpDate,
} from "@/lib/lead-insights";
import { LeadFormData } from "@/lib/types/lead";

const statusStyles: Record<string, string> = {
  new: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  contacted: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  converted: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  qualified: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  proposal: "border-purple-500/20 bg-purple-500/10 text-purple-600",
};

function FollowUpRow({ lead }: { lead: LeadFormData }) {
  const status = normalizeStatus(lead.status);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-1 py-3 last:border-b-0">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {lead.fullName}
          </p>
          <Badge
            variant="outline"
            className={`capitalize ${statusStyles[status] || "bg-muted text-muted-foreground"}`}
          >
            {formatLabel(status)}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {lead.company || "Individual Account"} - {lead.phone}
        </p>
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">{lead.followUpDate || "No date"}</p>
        <p>{lead.followUpTime || "Any time"}</p>
      </div>
    </div>
  );
}
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

const getCountsByField = (
  leads: ReturnType<typeof useLeads>["leads"],
  field: "source" | "assignedTo" | "budget",
) =>
  leads.reduce<Record<string, number>>((counts, lead) => {
    const value = lead[field]?.trim().toLowerCase() || "not specified";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

function MetricCard({
  title,
  value,
  detail,
  trend,
  icon: Icon,
  bgColor = "bg-blue-500",
}: {
  title: string;
  value: string | number;
  detail: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor?: string;
}) {
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

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { leads, isLoading, error, refetch } = useLeads();

  const statusCounts = getStatusCounts(leads);
  const serviceCounts = getServiceCounts(leads);
  const sourceCounts = getCountsByField(leads, "source");
  const ownerCounts = getCountsByField(leads, "assignedTo");
  const budgetCounts = getCountsByField(leads, "budget");

  const todayFollowUps = getTodayFollowUps(leads);
  const upcomingFollowUps = getUpcomingFollowUps(leads);
  const overdueFollowUps = getOverdueFollowUps(leads);
  const nextFollowUps = sortByFollowUpDate([
    ...todayFollowUps,
    ...upcomingFollowUps,
  ]).slice(0, 5);

  const closedCount = (statusCounts.converted || 0) + (statusCounts.qualified || 0);
  const activeCount = Math.max(leads.length - closedCount, 0);
  const assignedCount = leads.filter((lead) => Boolean(lead.assignedTo)).length;
  const conversionRate =
    leads.length > 0 ? Math.round((closedCount / leads.length) * 100) : 0;
  const followUpLoad = todayFollowUps.length + upcomingFollowUps.length + overdueFollowUps.length;

  // Data for line chart (real data from leads)
  const generateTrendData = () => {
    const data: Record<string, { date: string; leads: number; conversions: number }> = {};

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      data[dateStr] = { date: dateStr, leads: 0, conversions: 0 };
    }

    // Count real leads by followUpDate
    leads.forEach((lead) => {
      if (lead.followUpDate) {
        // Parse the followUpDate to match our format
        const followUpDateObj = new Date(lead.followUpDate);
        const dateStr = followUpDateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (data[dateStr]) {
          data[dateStr].leads += 1;
          // Count conversions (qualified or converted status)
          if (lead.status === "qualified" || lead.status === "converted") {
            data[dateStr].conversions += 1;
          }
        }
      }
    });

    return Object.values(data);
  };

  // Data for status pie chart
  const statusData = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: formatLabel(status),
      value: count,
      status: status,
    }));

  // Data for source bar chart
  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({
      name: formatLabel(source),
      count: count,
    }));

  // Data for service bar chart
  const serviceData = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([service, count]) => ({
      name: formatLabel(service),
      count: count,
    }));

  // Conversion funnel
  const funnelData = [
    { stage: "All Leads", count: leads.length },
    { stage: "Contacted", count: statusCounts.contacted || 0 },
    { stage: "Qualified", count: statusCounts.qualified || 0 },
    { stage: "Converted", count: statusCounts.converted || 0 },
  ];

  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
  ];

  const statusColors: Record<string, string> = {
    new: "#3b82f6",
    contacted: "#f59e0b",
    qualified: "#8b5cf6",
    converted: "#10b981",
    proposal: "#ec4899",
  };

  const trendData = generateTrendData();

  return (
    <main className="w-full space-y-6 px-6 py-6">
      <div className="space-y-6 pr-6 max-w-full">
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

      {/* Key Metrics */}
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

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Trend Chart */}
        <ChartCard
          title="Lead Pipeline Trend"
          description="Daily leads captured and conversions"
        >
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
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  name="New Leads"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Status Distribution */}
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
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[entry.status] || colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Leads by Source */}
        <ChartCard title="Leads by Source" description="Top lead sources">
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={500}>
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Service Demand */}
        <ChartCard title="Service Demand" description="Breakdown by service type">
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={500}>
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 8, 8, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Conversion Funnel */}
      <ChartCard
        title="Conversion Funnel"
        description="Lead journey through sales stages"
      >
        <div className="space-y-4">
          {funnelData.map((item, index) => {
            const percentage =
              funnelData[0].count > 0
                ? Math.round((item.count / funnelData[0].count) * 100)
                : 0;
            return (
              <div key={item.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.count}
                    </span>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all duration-300 ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                          ? "bg-amber-500"
                          : index === 2
                            ? "bg-purple-500"
                            : "bg-emerald-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* Next Follow-ups Section */}
      <ChartCard
        title="Next Follow-ups"
        description={`${todayFollowUps.length} today - ${upcomingFollowUps.length} upcoming`}
      >
        <div>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading follow-up queue...
            </p>
          ) : nextFollowUps.length > 0 ? (
            nextFollowUps.map((lead) => (
              <FollowUpRow key={lead._id || lead.phone} lead={lead} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No scheduled follow-ups found.
            </p>
          )}
        </div>
      </ChartCard>

      {/* Additional Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Assigned"
          value={isLoading ? "..." : assignedCount}
          detail={`${leads.length - assignedCount} lead${leads.length - assignedCount === 1 ? "" : "s"} unassigned`}
          icon={UserCheck}
          bgColor="bg-cyan-500"
        />
        <MetricCard
          title="Contacted"
          value={isLoading ? "..." : statusCounts.contacted || 0}
          detail="Leads with at least one outreach."
          icon={PhoneCall}
          bgColor="bg-orange-500"
        />
        <MetricCard
          title="Closed"
          value={isLoading ? "..." : closedCount}
          detail="Qualified or converted opportunities."
          icon={CheckCircle2}
          bgColor="bg-lime-500"
        />
      </div>

      {/* Summary Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Budget Distribution */}
        <ChartCard title="Budget Ranges" description="Lead distribution by budget">
          <div className="space-y-3">
            {Object.entries(budgetCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([budget, count]) => (
                <div
                  key={budget}
                  className="flex items-center justify-between rounded-lg bg-background p-4"
                >
                  <span className="font-medium text-foreground">
                    {formatLabel(budget)}
                  </span>
                  <span className="text-lg font-bold text-foreground">{count}</span>
                </div>
              ))}
          </div>
        </ChartCard>

        {/* Team Performance */}
        <ChartCard title="Team Performance" description="Leads assigned per team member">
          <div className="space-y-3">
            {Object.entries(ownerCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([owner, count]) => (
                <div
                  key={owner}
                  className="flex items-center justify-between rounded-lg bg-background p-4"
                >
                  <span className="font-medium text-foreground capitalize">
                    {owner}
                  </span>
                  <span className="text-lg font-bold text-foreground">{count}</span>
                </div>
              ))}
          </div>
        </ChartCard>

        {/* Follow-up Status */}
        <ChartCard title="Follow-up Status" description="Upcoming action items">
          <div className="space-y-3">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <div className="flex items-center justify-between">
                <span className="font-medium text-red-700 dark:text-red-300">Overdue</span>
                <span className="text-lg font-bold text-red-700 dark:text-red-300">
                  {overdueFollowUps.length}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
              <div className="flex items-center justify-between">
                <span className="font-medium text-amber-700 dark:text-amber-300">Today</span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {todayFollowUps.length}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
              <div className="flex items-center justify-between">
                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                  Upcoming
                </span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {upcomingFollowUps.length}
                </span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
      </div>
    </main>
  );
}
