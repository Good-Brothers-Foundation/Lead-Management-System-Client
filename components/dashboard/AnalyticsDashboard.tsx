"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  Users,
  Activity,
  Target,
  Zap,
  PhoneCall,
  UserCheck,
  Calendar,
  Briefcase,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  TrendingDown,
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
  AreaChart,
  Area,
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

export default function AnalyticsDashboard() {
  const { leads, isLoading, error, refetch } = useLeads();
  const [activeTab, setActiveTab] = useState("overview");

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
    <main className="w-full space-y-8 px-6 py-8 animate-fade-in">
      <div className="space-y-8 pr-6 max-w-full">
        
        {/* Core Page Heading Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-base text-muted-foreground font-medium">
              Real-time insights into your lead pipeline, conversion rates, and team performance.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={refetch}
            disabled={isLoading}
            className="h-11 px-5 gap-2 self-start sm:self-auto rounded-xl border-border/80 hover:bg-muted/50 hover:border-foreground/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Analytics
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Custom Tab switcher */}
        <div className="flex border-b border-border/60 gap-1 pb-px overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all duration-200 shrink-0 flex items-center gap-2.5 relative ${
              activeTab === "overview"
                ? "border-[#fd6102] text-[#fd6102] scale-[1.02]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab("channels")}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all duration-200 shrink-0 flex items-center gap-2.5 relative ${
              activeTab === "channels"
                ? "border-[#fd6102] text-[#fd6102] scale-[1.02]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Target className="h-4.5 w-4.5" />
            Pipeline & Channels
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all duration-200 shrink-0 flex items-center gap-2.5 relative ${
              activeTab === "operations"
                ? "border-[#fd6102] text-[#fd6102] scale-[1.02]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            Ops & Performance
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-8 animate-fade-in-up duration-300">
          {activeTab === "overview" && (
            <>
              {/* Global Pipeline Statistics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
                  detail={`${closedCount} qualified / converted`}
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
              <div className="grid gap-8 lg:grid-cols-1">
                <ChartCard title="Lead Pipeline Trend" description="Daily leads captured and conversions over time">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                        <XAxis 
                          dataKey="date" 
                          stroke="var(--muted-foreground)" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="var(--muted-foreground)" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          dx={-10}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)"
                          }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" name="New Leads" />
                        <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConversions)" name="Conversions" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              {/* Conversion Lifecycle Visual Funnel */}
              <ChartCard title="Conversion Funnel" description="Visual breakdown of lead journey stages & drop-off rates">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative py-4">
                  {funnelData.map((item, index) => {
                    const isLast = index === funnelData.length - 1;
                    const nextItem = funnelData[index + 1];
                    const stepConversion = (nextItem && item.count > 0)
                      ? Math.round((nextItem.count / item.count) * 100)
                      : 0;
                    
                    const funnelColors = [
                      "from-blue-500 to-indigo-500",
                      "from-amber-500 to-orange-500",
                      "from-purple-500 to-pink-500",
                      "from-emerald-500 to-teal-500"
                    ];
                    const icons = [Users, PhoneCall, UserCheck, CheckCircle2];
                    const IconComponent = icons[index];

                    return (
                      <div key={item.stage} className="flex flex-col relative">
                        <div className={`p-6 rounded-2xl bg-gradient-to-br ${funnelColors[index]} text-white shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300`}>
                          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300" />
                          
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold opacity-90 tracking-wide">{item.stage}</span>
                            <div className="p-1.5 rounded-lg bg-white/15">
                              <IconComponent className="h-5 w-5" />
                            </div>
                          </div>
                          <div>
                            <div className="text-4xl font-extrabold">{item.count}</div>
                            <div className="text-[11px] opacity-80 mt-1.5 font-medium">
                              {index === 0 ? "Initial Baseline" : `${Math.round((item.count / funnelData[0].count) * 100)}% of initial pool`}
                            </div>
                          </div>
                        </div>

                        {!isLast && nextItem && (
                          <div className="hidden lg:flex flex-col items-center justify-center absolute -right-4.5 top-1/2 -translate-y-1/2 z-10">
                            <div className="bg-card border border-border shadow-md h-9 w-9 rounded-full text-[10px] font-black text-foreground flex items-center justify-center hover:scale-110 transition-transform">
                              {stepConversion}%
                            </div>
                          </div>
                        )}
                        {!isLast && nextItem && (
                          <div className="flex lg:hidden items-center justify-center py-2 mt-1">
                            <div className="bg-muted border border-border/40 px-3 py-1 rounded-full text-xs font-bold text-foreground">
                              Conversion Rate: {stepConversion}%
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ChartCard>

              {/* Task Queue Queue List */}
              <ChartCard title="Next Follow-ups" description={`${todayFollowUps.length} today - ${upcomingFollowUps.length} upcoming actionable outreach tasks`}>
                <div className="divide-y divide-border/60">
                  {isLoading ? (
                    <p className="py-12 text-center text-sm font-semibold text-muted-foreground animate-pulse">Loading follow-up queue...</p>
                  ) : nextFollowUps.length > 0 ? (
                    <div className="space-y-1">
                      {nextFollowUps.map((lead) => <FollowUpRow key={lead._id || lead.phone} lead={lead} />)}
                    </div>
                  ) : (
                    <p className="py-12 text-center text-sm font-semibold text-muted-foreground">No scheduled follow-ups found.</p>
                  )}
                </div>
              </ChartCard>
            </>
          )}

          {activeTab === "channels" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <ChartCard title="Lead Status Distribution" description="Proportional breakdown of lead pipeline states">
                <div className="relative flex justify-center items-center h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={STATUS_COLORS[entry.status] || RECHARTS_PALETTE[index % RECHARTS_PALETTE.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "var(--card)", 
                          border: "1px solid var(--border)", 
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center metrics overlay */}
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-foreground tracking-tight">{leads.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Total Leads</span>
                  </div>
                </div>
                
                {/* Custom Color Legend indicators */}
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4 border-t border-border/40 pt-4">
                  {statusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: STATUS_COLORS[entry.status] || RECHARTS_PALETTE[index % RECHARTS_PALETTE.length] }} 
                      />
                      <span className="text-xs font-semibold text-foreground">{entry.name}</span>
                      <span className="text-xs text-muted-foreground">({entry.value})</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Leads by Source" description="Top lead channels and marketing source performance">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 0 }} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.6} />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="var(--muted-foreground)" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        width={90} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "var(--card)", 
                          border: "1px solid var(--border)", 
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)"
                        }} 
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Lead Count">
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RECHARTS_PALETTE[index % RECHARTS_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <div className="lg:col-span-2">
                <ChartCard title="Service Demand" description="Lead requirements grouped by service offering requested">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--muted-foreground)" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10} 
                        />
                        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "var(--card)", 
                            border: "1px solid var(--border)", 
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)"
                          }} 
                        />
                        <Bar dataKey="count" fill="#ec4899" radius={[6, 6, 0, 0]} name="Requests">
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={RECHARTS_PALETTE[(index + 2) % RECHARTS_PALETTE.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {activeTab === "operations" && (
            <>
              {/* Operational Status Threshold Metrics */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <MetricCard title="Assigned" value={isLoading ? "..." : assignedCount} detail={`${leads.length - assignedCount} leads unassigned`} icon={UserCheck} bgColor="bg-cyan-500" />
                <MetricCard title="Contacted" value={isLoading ? "..." : statusCounts.contacted || 0} detail="Leads with at least one outreach" icon={PhoneCall} bgColor="bg-orange-500" />
                <MetricCard title="Closed Opportunities" value={isLoading ? "..." : closedCount} detail="Qualified or converted sales targets" icon={CheckCircle2} bgColor="bg-lime-500" />
              </div>

              {/* Bottom Metadata Categorization Vectors */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <ChartCard title="Budget Ranges" description="Lead breakdown grouped by purchase budgets">
                  <div className="space-y-3.5">
                    {Object.entries(budgetCounts).length > 0 ? (
                      Object.entries(budgetCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([budget, count]) => {
                          const percent = Math.round((count / leads.length) * 100) || 0;
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

                <ChartCard title="Team Performance" description="Active leads distribution per team owner">
                  <div className="space-y-3.5">
                    {Object.entries(ownerCounts).length > 0 ? (
                      Object.entries(ownerCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([owner, count]) => {
                          const percent = Math.round((count / leads.length) * 100) || 0;
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

                <ChartCard title="Follow-up Urgency" description="Current action items categorized by delay threshold">
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-red-500/10 border border-red-500/10 p-4.5 flex items-center justify-between group hover:bg-red-500/15 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                          !
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">Overdue</p>
                          <p className="text-xs text-muted-foreground font-medium">Requires immediate outreach</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-red-600">{overdueFollowUps.length}</span>
                    </div>

                    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/10 p-4.5 flex items-center justify-between group hover:bg-amber-500/15 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                          T
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">Due Today</p>
                          <p className="text-xs text-muted-foreground font-medium">Outreach tasks scheduled for today</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-amber-600">{todayFollowUps.length}</span>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/10 p-4.5 flex items-center justify-between group hover:bg-emerald-500/15 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                          U
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">Upcoming</p>
                          <p className="text-xs text-muted-foreground font-medium">Future scheduled touches</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-emerald-600">{upcomingFollowUps.length}</span>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}