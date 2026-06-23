"use client";

import { useState, useMemo, useEffect } from "react";
import { RefreshCw, Activity, Target, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teamTasksApi } from "@/lib/api/team";
import { TeamTask } from "@/lib/types/team";
import { useLeads } from "@/hooks/use-leads";
import {
  formatLabel, getOverdueFollowUps, getServiceCounts, getStatusCounts, getTodayFollowUps, getUpcomingFollowUps, sortByFollowUpDate
} from "@/lib/lead-insights";
import { generateTrendData, getCountsByField } from "@/lib/utils";
import { SummaryTab } from "./analytics/summary-tab";
import { ChannelsTab } from "./analytics/channels-tab";
import { OperationsTab } from "./analytics/operations-tab";

export default function AnalyticsDashboard() {
  const { leads = [], isLoading, error, refetch } = useLeads();
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState<TeamTask[]>([]);

  useEffect(() => {
    teamTasksApi.getAll().then(setTasks).catch((e) => console.error(e));
  }, []);

  // Memoizing deep calculation trees guarantees rapid tab routing responses
  const aggregatedData = useMemo(() => {
    if (leads.length === 0) return null;

    const statusCounts = getStatusCounts(leads);
    const todayFollowUps = getTodayFollowUps(leads);
    const upcomingFollowUps = getUpcomingFollowUps(leads);
    const overdueFollowUps = getOverdueFollowUps(leads);

    const closedCount = (statusCounts.converted || 0) + (statusCounts.qualified || 0);

    return {
      statusCounts,
      serviceCounts: getServiceCounts(leads),
      sourceCounts: getCountsByField(leads, "source"),
      ownerCounts: getCountsByField(leads, "assignedTo"),
      budgetCounts: getCountsByField(leads, "budget"),
      todayFollowUps,
      upcomingFollowUps,
      overdueFollowUps,
      nextFollowUps: sortByFollowUpDate([...todayFollowUps, ...upcomingFollowUps]).slice(0, 5),
      closedCount,
      activeCount: Math.max(leads.length - closedCount, 0),
      assignedCount: leads.filter((l) => Boolean(l.assignedTo)).length,
      conversionRate: Math.round((closedCount / leads.length) * 100),
      trendData: generateTrendData(leads),
    };
  }, [leads]);

  if (isLoading && !aggregatedData) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center space-y-4 py-20">
        <RefreshCw className="h-9 w-9 text-[#fd6102] animate-spin" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse">Aggregating live lead insights...</p>
      </div>
    );
  }

  const data = aggregatedData || {
    statusCounts: {}, serviceCounts: {}, sourceCounts: {}, ownerCounts: {}, budgetCounts: {},
    todayFollowUps: [], upcomingFollowUps: [], overdueFollowUps: [], nextFollowUps: [],
    closedCount: 0, activeCount: 0, assignedCount: 0, conversionRate: 0, trendData: []
  };

  const statusData = Object.entries(data.statusCounts).filter(([, c]) => c > 0).map(([status, count]) => ({ name: formatLabel(status), value: count, status }));
  const sourceData = Object.entries(data.sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([source, count]) => ({ name: formatLabel(source), count }));
  const serviceData = Object.entries(data.serviceCounts).sort((a, b) => b[1] - a[1]).map(([service, count]) => ({ name: formatLabel(service), count }));
  const funnelData = [
    { stage: "All Leads", count: leads.length },
    { stage: "Contacted", count: data.statusCounts.contacted || 0 },
    { stage: "Qualified", count: data.statusCounts.qualified || 0 },
    { stage: "Converted", count: data.statusCounts.converted || 0 },
  ];

  return (
    <main className="w-full space-y-8 px-6 py-8 animate-fade-in">
      <div className="space-y-8 pr-6 max-w-full">
        
        {/* Core Page Heading Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Analytics Dashboard</h1>
            <p className="mt-2 text-base text-muted-foreground font-medium">Real-time insights into your lead pipeline, conversion rates, and team performance.</p>
          </div>
          <Button type="button" variant="outline" onClick={refetch} disabled={isLoading} className="h-11 px-5 gap-2 rounded-xl border-border/80 transition-all shadow-sm">
            <RefreshCw className={`h-4.5 w-4.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Analytics
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{typeof error === "string" ? error : "Data load exception"}</span>
          </div>
        )}

        {/* Custom Tab switcher */}
        <div className="flex border-b border-border/60 gap-1 pb-px overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Executive Summary", icon: Activity },
            { id: "channels", label: "Pipeline & Channels", icon: Target },
            { id: "operations", label: "Ops & Performance", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all duration-200 shrink-0 flex items-center gap-2.5 relative ${
                activeTab === tab.id ? "border-[#fd6102] text-[#fd6102] scale-[1.02]" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4.5 w-4.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Decoupled Tab Routing Blocks */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <SummaryTab
              leads={leads}
              metrics={{
                conversionRate: data.conversionRate, closedCount: data.closedCount, activeCount: data.activeCount,
                followUpLoad: data.todayFollowUps.length + data.upcomingFollowUps.length + data.overdueFollowUps.length,
                overdueCount: data.overdueFollowUps.length, todayCount: data.todayFollowUps.length
              }}
              trendData={data.trendData}
              funnelData={funnelData}
              nextFollowUps={data.nextFollowUps}
            />
          )}

          {activeTab === "channels" && (
            <ChannelsTab totalLeads={leads.length} statusData={statusData} sourceData={sourceData} serviceData={serviceData} />
          )}

          {activeTab === "operations" && (
            <OperationsTab
              totalLeads={leads.length} assignedCount={data.assignedCount} contactedCount={data.statusCounts.contacted || 0}
              closedCount={data.closedCount} budgetCounts={data.budgetCounts} ownerCounts={data.ownerCounts}
              urgency={{ overdue: data.overdueFollowUps.length, today: data.todayFollowUps.length, upcoming: data.upcomingFollowUps.length }}
              tasks={tasks}
            />
          )}
        </div>
      </div>
    </main>
  );
}