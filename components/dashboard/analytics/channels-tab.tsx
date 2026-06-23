"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "../sections/ChartCard";
import { RECHARTS_PALETTE, STATUS_COLORS } from "@/lib/data/dashboard.color";

export interface StatusDataEntry {
  status: string;
  name: string;
  value: number;
}

export interface SourceDataEntry {
  name: string;
  count: number;
}

export interface ServiceDataEntry {
  name: string;
  count: number;
}

interface ChannelsTabProps {
  totalLeads: number;
  statusData: StatusDataEntry[];
  sourceData: SourceDataEntry[];
  serviceData: ServiceDataEntry[];
}

export function ChannelsTab({ totalLeads, statusData, sourceData, serviceData }: ChannelsTabProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Distribution Block */}
      <ChartCard title="Lead Status Distribution" description="Proportional breakdown of lead pipeline states">
        <div className="relative flex justify-center items-center h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={4} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || RECHARTS_PALETTE[index % RECHARTS_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-foreground tracking-tight">{totalLeads}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Total Leads</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4 border-t border-border/40 pt-4">
          {statusData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.status] || RECHARTS_PALETTE[index % RECHARTS_PALETTE.length] }} />
              <span className="text-xs font-semibold text-foreground">{entry.name}</span>
              <span className="text-xs text-muted-foreground">({entry.value})</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Source Matrix */}
      <ChartCard title="Leads by Source" description="Top lead channels and marketing source performance">
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.6} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} />
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
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} />
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
  );
}