// app/follow-ups/[items]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LeadFormData } from "@/lib/types/lead";
import { filterFollowUpsByRoute } from "@/lib/utils";
import { FollowUpList } from "@/components/followUps/FollowUpList";
import { dummyLeads } from "@/lib/data/LeadDummyData";


export default function FollowUps() {
  const params = useParams();
  
  // Clean parameter formatting fallback protection matching Next.js execution parameters
  const currentItem = Array.isArray(params?.items) 
    ? params.items[0] 
    : params?.items || "today";

  const [leads, setLeads] = useState<LeadFormData[]>(dummyLeads);

  // Compute live state calculation downstream matching parametric routes
  const filteredLeads = filterFollowUpsByRoute(leads, currentItem);

  const handleUpdateLead = (updatedLead: LeadFormData) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
          {currentItem} Follow Ups
        </h1>
        <p className="text-sm text-muted-foreground">
          {getHeaderDescription()}
        </p>
      </div>

      {/* Render Decoupled Card List component wrapper */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Follow Up Overview List
        </h2>
        <FollowUpList
          leads={filteredLeads}
          onUpdateLead={handleUpdateLead}
          emptyMessage={`No follow-up records listed under the "${currentItem}" classification section.`}
        />
      </div>
    </main>
  );
}