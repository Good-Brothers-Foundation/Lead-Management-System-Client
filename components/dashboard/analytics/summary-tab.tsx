"use client";

import { Activity, Target, Users, Zap, CheckCircle2, PhoneCall, UserCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MetricCard } from "../sections/MetricCard";
import { ChartCard } from "../sections/ChartCard";
import { FollowUpRow } from "../sections/FollowUpRow";
import { LeadFormData } from "@/lib/types/lead";

export interface TrendDataEntry {
  date: string;
  leads: number;
  conversions: number;
}

export interface FunnelDataEntry {
  stage: string;
  count: number;
}

interface SummaryTabProps {
  leads: LeadFormData[];
  metrics: {
    conversionRate: number;
    closedCount: number;
    activeCount: number;
    followUpLoad: number;
    overdueCount: number;
    todayCount: number;
  };
  trendData: TrendDataEntry[];
  funnelData: FunnelDataEntry[];
  nextFollowUps: LeadFormData[];
}

export function SummaryTab({ leads, metrics, trendData, funnelData, nextFollowUps }: SummaryTabProps) {
  const funnelColors = [
    "from-blue-500 to-indigo-500",
    "from-amber-500 to-orange-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500"
  ];
  const funnelIcons = [Users, PhoneCall, UserCheck, CheckCircle2];

  return (
    <>
      {/* Global Pipeline Statistics Overview */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Leads" value={leads.length} detail="Leads in your pipeline" icon={Users} bgColor="bg-blue-500" />
        <MetricCard title="Conversion Rate" value={`${metrics.conversionRate}%`} detail={`${metrics.closedCount} qualified / converted`} trend={metrics.conversionRate > 30 ? "↑ Strong performance" : "↓ Needs improvement"} icon={Target} bgColor="bg-emerald-500" />
        <MetricCard title="Active Pipeline" value={metrics.activeCount} detail="Leads being worked on" icon={Activity} bgColor="bg-amber-500" />
        <MetricCard title="Follow-ups Due" value={metrics.followUpLoad} detail={`${metrics.overdueCount} overdue, ${metrics.todayCount} today`} trend={metrics.overdueCount > 0 ? `⚠ ${metrics.overdueCount} overdue` : "✓ All current"} icon={Zap} bgColor={metrics.overdueCount > 0 ? "bg-red-500" : "bg-emerald-500"} />
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
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} />
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
            const stepConversion = (nextItem && item.count > 0) ? Math.round((nextItem.count / item.count) * 100) : 0;
            const IconComponent = funnelIcons[index];

            return (
              <div key={item.stage} className="flex flex-col relative">
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${funnelColors[index]} text-white shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300`}>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300" />
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold opacity-90 tracking-wide">{item.stage}</span>
                    <div className="p-1.5 rounded-lg bg-white/15"><IconComponent className="h-5 w-5" /></div>
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
      <ChartCard title="Next Follow-ups" description={`${metrics.todayCount} today - ${metrics.followUpLoad - metrics.todayCount - metrics.overdueCount} upcoming actionable outreach tasks`}>
        <div className="divide-y divide-border/60">
          {nextFollowUps.length > 0 ? (
            <div className="space-y-1">
              {nextFollowUps.map((lead) => <FollowUpRow key={lead._id || lead.phone} lead={lead} />)}
            </div>
          ) : (
            <p className="py-12 text-center text-sm font-semibold text-muted-foreground">No scheduled follow-ups found.</p>
          )}
        </div>
      </ChartCard>
    </>
  );
}