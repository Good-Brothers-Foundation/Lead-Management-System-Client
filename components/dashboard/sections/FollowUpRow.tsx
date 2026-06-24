"use client";

import { LeadFormData } from "@/lib/types/lead";
import { Calendar, Clock, Phone, Zap } from "lucide-react";

const PRIORITY_STYLES = {
  high: { bar: "#ef4444", badge: "bg-red-500/10 text-red-600 border-red-500/20" },
  medium: { bar: "#f59e0b", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  low: { bar: "#6b7280", badge: "bg-muted text-muted-foreground border-border" },
};

export function FollowUpRow({ lead }: { lead: LeadFormData }) {
  const priority = (lead.priority?.toLowerCase() || "low") as "high" | "medium" | "low";
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.low;

  const formattedDate = lead.followUpDate
    ? new Date(lead.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "No date set";

  return (
    <div
      className="flex items-center gap-4 py-3.5 px-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors group rounded-xl -mx-1"
      style={{ borderLeft: `3px solid ${style.bar}` }}
    >
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black text-white"
          style={{ background: style.bar }}
        >
          {lead.fullName?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate group-hover:text-[#fd6102] transition-colors">
            {lead.fullName}
          </p>
          <p className="text-[11px] text-muted-foreground font-medium truncate">
            {lead.category || "—"} {lead.phone ? `· ${lead.phone}` : ""}
          </p>
        </div>
      </div>

      {/* Center: Contact method */}
      {lead.contactMethod && (
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium capitalize">{lead.contactMethod}</span>
        </div>
      )}

      {/* Right: Date + Priority */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{lead.followUpTime || "Any time"}</span>
        </div>
      </div>

      {/* Priority badge */}
      <span className={`hidden md:inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${style.badge}`}>
        <Zap className="h-2.5 w-2.5" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    </div>
  );
}