"use client";

import Image from "next/image";
import { Phone, Mail, UserCheck, Eye } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LeadFormData } from "@/lib/types/lead";

interface LeadTableRowProps {
  lead: LeadFormData;
  onViewDetails: (lead: LeadFormData) => void;
  onWhatsAppClick: (lead: LeadFormData) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "new": return { bg: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "New" };
    case "contacted": return { bg: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Contacted" };
    case "converted": return { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Qualified" };
    case "proposal": return { bg: "bg-purple-500/10 text-purple-600 border-purple-500/20", label: "Proposal Sent" };
    default: return { bg: "bg-muted text-muted-foreground", label: status };
  }
};

export function LeadTableRow({ lead, onViewDetails, onWhatsAppClick }: LeadTableRowProps) {
  const statusMeta = getStatusStyles(lead.status);

  const handleWhatsAppRedirect = () => {
    onWhatsAppClick(lead);
  };

  return (
    <TableRow className="border-b border-border hover:bg-muted/20 transition-colors">
      {/* Identity */}
      <TableCell className="font-medium py-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground tracking-tight">{lead.fullName}</span>
          {lead.category && <span className="text-xs text-muted-foreground mt-0.5">{lead.category}</span>}
        </div>
      </TableCell>

      {/* Contacts */}
      <TableCell>
        <div className="flex flex-col space-y-0.5 text-xs">
          <span className="text-foreground inline-flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" /> {lead.phone}
          </span>
          {lead.emails && lead.emails.length > 0 && (
            <span className="text-muted-foreground inline-flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" /> {lead.emails[0]}
            </span>
          )}
        </div>
      </TableCell>

      {/* Core Fields */}
      <TableCell className="capitalize text-xs font-semibold text-foreground">{lead.service}</TableCell>
      <TableCell className="capitalize text-xs text-muted-foreground font-medium">{lead.source}</TableCell>

      {/* Status Badge */}
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg}`}>
          {statusMeta.label}
        </span>
      </TableCell>

      {/* Owner Assignment */}
      <TableCell>
        {lead.assignedTo ? (
          <span className="text-xs font-semibold text-foreground inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md capitalize">
            <UserCheck className="h-3 w-3 text-muted-foreground" /> {lead.assignedTo}
          </span>
        ) : (
          <span className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-md font-medium">
            Unassigned
          </span>
        )}
      </TableCell>

      {/* Context Execution Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleWhatsAppRedirect}
            className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer transition-colors flex items-center justify-center hover:bg-green-500/10"
          >
            <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={14} height={14} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onViewDetails(lead)}
            className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer transition-colors flex items-center justify-center hover:bg-[var(--button-primary)]"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}