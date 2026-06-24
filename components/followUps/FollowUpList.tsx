// components/leads/FollowUpList.tsx
"use client";

import { useState } from "react";
import { LeadFormData } from "@/lib/types/lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Eye } from "lucide-react";
import LeadDetailDrawer from "../leads/all/LeadDetailSheet";
import Image from "next/image";
import { WhatsAppTemplateModal } from "../leads/all/sections/WhatsAppTemplateModal";

interface FollowUpListProps {
  leads: LeadFormData[];
  onUpdateLead: (updatedLead: LeadFormData) => void;
  emptyMessage: string;
}

export function FollowUpList({
  leads,
  onUpdateLead,
  emptyMessage,
}: FollowUpListProps) {
  const [selectedLead, setSelectedLead] = useState<LeadFormData | null>(null);

  // WhatsApp Modal state
  const [whatsappLead, setWhatsappLead] = useState<LeadFormData | null>(null);
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleWhatsAppClick = (lead: LeadFormData) => {
    setWhatsappLead(lead);
    setIsWhatsappOpen(true);
  };

  if (leads.length === 0) {
    return (
      <div className="flex h-62.5 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-background/50">
        <Calendar className="h-8 w-8 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid List View Layout */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="flex flex-col justify-between p-5 border border-border rounded-xl bg-card shadow-xs hover:shadow-sm transition-all"
          >
            <div className="space-y-3 text-left">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-foreground truncate max-w-[150px]">
                    {lead.fullName}
                  </h3>
                  {lead.category && (
                    <p className="text-[10px] font-semibold text-muted-foreground">
                      {lead.category}
                    </p>
                  )}
                </div>
                <Badge
                  className={`capitalize font-bold border px-2.5 py-0.5 rounded-full text-[10px] ${getPriorityColor(
                    lead.priority
                  )}`}
                >
                  {lead.priority || "Normal"} Priority
                </Badge>
              </div>

              {/* Follow-up schedule times */}
              <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                <p className="inline-flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" />
                  <span>
                    Scheduled:{" "}
                    {lead.followUpDate
                      ? new Date(lead.followUpDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </p>
                <p className="inline-flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/75" />
                  <span>Time: {lead.followUpTime || "—"}</span>
                </p>
                {lead.assignedTo && (
                  <p className="inline-flex items-center gap-1.5 font-medium">
                    <User className="h-3.5 w-3.5 text-muted-foreground/75" />
                    <span className="capitalize">Owner: {lead.assignedTo}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Render Bottom Row Interaction Area */}
            <div className="border-t border-border/60 pt-4.5 mt-5 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-[#fd6102] bg-[#fd6102]/5 border border-[#fd6102]/10 px-2 py-0.5 rounded">
                {lead.service || "Unspecified"}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLead(lead)}
                  className="h-9 flex-1 gap-2 text-xs font-semibold cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleWhatsAppClick(lead)}
                  className="h-9 px-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 transition-colors cursor-pointer"
                  title="Contact via WhatsApp"
                >
                  <Image
                    src="/icons/whatsapp.svg"
                    alt="WhatsApp"
                    width={14} 
                    height={14}
                  />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out Drawer Integration */}
      <LeadDetailDrawer
        key={selectedLead?._id || "empty-follow-drawer"}
        lead={selectedLead}
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        onUpdate={(updatedData) => {
          onUpdateLead(updatedData);
          setSelectedLead(updatedData);
        }}
      />

      {/* WhatsApp Template Selector Modal */}
      <WhatsAppTemplateModal
        lead={whatsappLead}
        isOpen={isWhatsappOpen}
        onClose={() => setIsWhatsappOpen(false)}
      />
    </div>
  );
}
