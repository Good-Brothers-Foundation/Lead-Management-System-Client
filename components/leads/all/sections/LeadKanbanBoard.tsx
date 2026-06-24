"use client";

import { LeadFormData } from "@/lib/types/lead";
import { UserCheck, Phone, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import { formatLabel } from "@/lib/lead-insights";

interface LeadKanbanBoardProps {
  leads: LeadFormData[];
  onViewDetails: (lead: LeadFormData) => void;
  onUpdateLead: (lead: LeadFormData) => Promise<void> | void;
}

const COLUMNS = [
  { id: "new", title: "New", color: "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800" },
  { id: "contacted", title: "Contacted", color: "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800" },
  { id: "qualified", title: "Qualified", color: "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800" },
  { id: "proposal", title: "Proposal Sent", color: "bg-purple-500/10 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800" },
  { id: "converted", title: "Converted", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800" },
  { id: "unqualified", title: "Unqualified", color: "bg-rose-500/10 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-800" },
] as const;

export function LeadKanbanBoard({
  leads,
  onViewDetails,
  onUpdateLead,
}: LeadKanbanBoardProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeOverColumn, setActiveOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("leadId", id);
    setActiveDragId(id);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
    setActiveOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setActiveOverColumn(columnId);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    setActiveOverColumn(null);
    setActiveDragId(null);

    if (!leadId) return;

    const lead = leads.find((l) => l._id === leadId);
    if (!lead || lead.status === columnId) return;

    const updatedLead = { ...lead, status: columnId };
    await onUpdateLead(updatedLead);
  };

  return (
    <div className="flex overflow-x-auto pb-6 gap-4 items-stretch select-none">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((lead) => (lead.status || "new") === col.id);

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setActiveOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col w-[280px] shrink-0 bg-muted/20 dark:bg-muted/5 border border-border/80 rounded-2xl p-4 min-h-[550px] transition-all duration-200
              ${activeOverColumn === col.id ? "bg-muted/40 border-[var(--button-secondary)]/30 shadow-inner" : ""}
            `}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${col.color}`}>
                {col.title}
              </span>
              <span className="text-xs font-bold text-muted-foreground bg-muted/60 dark:bg-muted/20 px-2 py-0.5 rounded-md">
                {colLeads.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[620px] pr-1.5 scrollbar-thin">
              {colLeads.length > 0 ? (
                colLeads.map((lead) => {
                  const leadId = lead._id || "";
                  const ownerName = lead.assignedTo ? lead.assignedTo.replace(/-/g, " ") : "Unassigned";

                  return (
                    <div
                      key={lead._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, leadId)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onViewDetails(lead)}
                      className={`group bg-card border border-border/60 hover:border-border/80 p-4 rounded-xl shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing select-none transition-all duration-200 relative flex flex-col gap-3 hover:-translate-y-0.5
                        ${activeDragId === leadId ? "opacity-35 scale-95" : ""}
                      `}
                    >
                      {/* Top Row: Name */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-foreground leading-tight tracking-tight group-hover:text-[#fd6102] transition-colors line-clamp-2">
                          {lead.fullName}
                        </span>
                      </div>

                      {/* Middle: Details */}
                      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground/95 leading-relaxed">
                        {lead.category && (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/85">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                            {lead.category}
                          </span>
                        )}
                        {lead.address && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                            <span className="truncate max-w-[210px]">{lead.address}</span>
                          </span>
                        )}
                        {lead.phone && (
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                            {lead.phone}
                          </span>
                        )}
                      </div>

                      {/* Bottom Row: Service and Owner */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-border/40 mt-0.5">
                        <div className="flex items-center gap-1.5 font-medium text-foreground/80 text-[11px]">
                          <div className="h-5 w-5 rounded-full bg-[#fd6102]/10 border border-[#fd6102]/20 flex items-center justify-center text-[#fd6102] font-bold text-[10px] shrink-0">
                            {ownerName.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[85px] capitalize">{ownerName}</span>
                        </div>

                        {lead.service ? (
                          <span className="text-[10px] font-bold text-[#fd6102] bg-[#fd6102]/5 border border-[#fd6102]/10 px-2 py-0.5 rounded-md truncate max-w-[120px] uppercase tracking-wide">
                            {formatLabel(lead.service)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                            Unspecified
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-28 border border-dashed border-border/60 rounded-xl flex items-center justify-center text-xs text-muted-foreground/75 italic bg-muted/5">
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
