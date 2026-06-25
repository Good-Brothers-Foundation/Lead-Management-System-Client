"use client";

import Image from "next/image";
import { Phone, Mail, UserCheck, Eye, MapPin } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LeadFormData } from "@/lib/types/lead";
import { formatLabel } from "@/lib/lead-insights";

interface LeadTableRowProps {
  lead: LeadFormData;
  onViewDetails: (lead: LeadFormData) => void;
  onWhatsAppClick: (lead: LeadFormData) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "new":
      return {
        bg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        label: "New",
      };
    case "contacted":
      return {
        bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        label: "Contacted",
      };
    case "qualified":
      return {
        bg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        label: "Qualified",
      };
    case "proposal":
      return {
        bg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        label: "Proposal Sent",
      };
    case "converted":
      return {
        bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: "Converted",
      };
    case "unqualified":
      return {
        bg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        label: "Unqualified",
      };
    default:
      return { bg: "bg-muted text-muted-foreground", label: status };
  }
};

export function LeadTableRow({
  lead,
  onViewDetails,
  onWhatsAppClick,
}: LeadTableRowProps) {
  const statusMeta = getStatusStyles(lead.status);

  const handleWhatsAppRedirect = () => {
    onWhatsAppClick(lead);
  };

  return (
    <TableRow className="border-b border-border hover:bg-muted/20 transition-colors">
      {/* Identity — w-[20%] on the matching TableHead */}
      <TableCell className="font-medium py-3.5 w-[20%] overflow-hidden align-center">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-foreground text-wrap">
              {lead.fullName}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground mt-0.5 min-w-0">
            {lead.category && (
              <span className="font-medium truncate">
                Category: {lead.category}
              </span>
            )}
            {lead.address && (
              <span className="inline-flex items-center gap-1 mt-0.5 min-w-0">
                <MapPin className="h-3 w-3 text-muted-foreground/75 shrink-0" />
                <span className="truncate">{lead.address}</span>
              </span>
            )}
          </div>
        </div>
      </TableCell>

      {/* Contacts — w-[16%] on the matching TableHead */}
      <TableCell className="w-[16%] overflow-hidden align-center">
        <div className="flex flex-col space-y-0.5 text-xs min-w-0">
          <span className="text-foreground inline-flex items-center gap-1 min-w-0">
            <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{lead.phone}</span>
          </span>
          {lead.emails && lead.emails.length > 0 && (
            <span className="text-muted-foreground inline-flex items-center gap-1 min-w-0">
              <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="truncate">{lead.emails[0]}</span>
            </span>
          )}
        </div>
      </TableCell>

      {/* potential service */}
      <TableCell className="capitalize text-xs font-semibold text-foreground w-[14%] truncate align-center">
        {lead.website ? (
          <span
            className={`inline-flex items-center max-w-full px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 border-emerald-500/20`}
          >
            <span className="truncate">Yes</span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center max-w-full px-2.5 py-0.5 rounded-full text-xs font-bold border bg-rose-500/10 text-rose-600 border-rose-500/20`}
          >
            <span className="truncate">No</span>
          </span>
        )}
      </TableCell>

      {/* Core Fields — widths match TableHead: w-[14%] and w-[12%] */}
      <TableCell className="capitalize text-xs font-semibold text-foreground w-[14%] truncate align-center">
        {lead.service}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground font-medium w-[12%] truncate align-center">
        {formatLabel(lead.source)}
      </TableCell>

      {/* Status Badge — w-[12%] on the matching TableHead */}
      <TableCell className="w-[12%] overflow-hidden align-center">
        <span
          className={`inline-flex items-center max-w-full px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg}`}
        >
          <span className="truncate">{statusMeta.label}</span>
        </span>
      </TableCell>

      {/* Owner Assignment — w-[14%] on the matching TableHead */}
      <TableCell className="w-[14%] overflow-hidden align-center">
        {lead.assignedTo ? (
          <span className="text-xs font-semibold text-foreground inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md capitalize max-w-full">
            <UserCheck className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{lead.assignedTo}</span>
          </span>
        ) : (
          <span className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-md font-medium">
            Unassigned
          </span>
        )}
      </TableCell>

      {/* Context Execution Actions — w-[12%] on the matching TableHead */}
      <TableCell className="text-right w-[10%] align-center">
        <div className="flex items-center justify-end gap-1 flex-wrap">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleWhatsAppRedirect}
            className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer transition-colors flex items-center justify-center hover:bg-green-500/10"
          >
            <Image
              src="/icons/whatsapp.svg"
              alt="WhatsApp"
              width={14}
              height={14}
            />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onViewDetails(lead)}
            className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer transition-colors flex items-center justify-center hover:bg-(--button-primary)"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
