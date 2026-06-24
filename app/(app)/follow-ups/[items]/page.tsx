// app/follow-ups/[items]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { LeadFormData } from "@/lib/types/lead";
import { filterFollowUpsByRoute } from "@/lib/utils";
import { FollowUpList } from "@/components/followUps/FollowUpList";
import { useLeads } from "@/hooks/use-leads";


export default function FollowUps() {
  const params = useParams();
  
  // Clean parameter formatting fallback protection matching Next.js execution parameters
  const currentItem = Array.isArray(params?.items) 
    ? params.items[0] 
    : params?.items || "today";

  const { leads, isLoading, error, updateLead } = useLeads();

  // Compute live state calculation downstream matching parametric routes
  const filteredLeads = filterFollowUpsByRoute(leads, currentItem);

  const handleUpdateLead = async (updatedLead: LeadFormData) => {
    await updateLead(updatedLead);
  };

  const getHeaderDescription = () => {
    if (currentItem === "today") {
      return "Manage and track follow-up activities assigned for completion today.";
    }
    if (currentItem === "upcoming") {
      return "Review future tasks and upcoming pipelines scheduled over the next weeks.";
    }
    return "Track overview data records across active prospects.";
  };

  return (
    <main className="p-6 space-y-8">
      {/* Top Main Heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
            {currentItem} Follow Ups
          </h1>
          {!isLoading && (
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-[var(--button-secondary)]/10 border border-[var(--button-secondary)]/20 text-[var(--button-secondary)] text-xs font-black tabular-nums">
              {filteredLeads.length}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {getHeaderDescription()}
        </p>
      </div>

      {/* Render Decoupled Card List component wrapper */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          Follow Up Overview List
          {!isLoading && (
            <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-muted text-muted-foreground text-[10px] font-black tabular-nums">
              {filteredLeads.length}
            </span>
          )}
        </h2>
        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : isLoading ? (
          <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
            Loading follow-up records...
          </div>
        ) : (
          <FollowUpList
            leads={filteredLeads}
            onUpdateLead={handleUpdateLead}
            emptyMessage={`No follow-up records listed under the "${currentItem}" classification section.`}
          />
        )}
      </div>
    </main>
  );
}