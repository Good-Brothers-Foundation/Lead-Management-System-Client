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

export function FollowUpList({ leads, onUpdateLead, emptyMessage }: FollowUpListProps) {
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
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="group relative flex flex-col justify-between p-6 bg-card border border-border rounded-xl shadow-sm transition-all"
          >
            <div className="space-y-4">
              {/* Header Info Block */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground tracking-tight">
                    {lead.fullName}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    {lead.category || "Individual Account"}
                  </p>
                </div>
                {lead.priority && (
                  <Badge variant="outline" className={`capitalize font-semibold ${getPriorityColor(lead.priority)}`}>
                    {lead.priority}
                  </Badge>
                )}
              </div>

              {/* Meta Timestamps Layout */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground/90 pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{lead.followUpDate}</span>
                </div>
                {lead.followUpTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{lead.followUpTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span className="capitalize">{lead.assignedTo || "Unassigned"}</span>
                </div>
              </div>

              {/* Explicit Action Interface Layer */}
              <div className="flex items-center gap-2 pt-2">
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
    </>
  );
}
