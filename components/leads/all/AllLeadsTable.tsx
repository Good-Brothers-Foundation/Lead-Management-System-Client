"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LeadFormData } from "@/lib/types/lead";
import { Search, UserCheck, Phone, Mail, Eye, RefreshCw } from "lucide-react";
import LeadDetailSheet from "./LeadDetailSheet";
import Image from "next/image";
import { useLeads } from "@/hooks/use-leads";

export default function AllLeadsTable() {
  const { leads, isLoading, error, refetch, updateLead } = useLeads();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Sliding Context Drawer Local States 
  const [selectedLead, setSelectedLead] = useState<LeadFormData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenDetails = (lead: LeadFormData) => {
    setSelectedLead(lead);
    setIsSheetOpen(true);
  };

  const handleUpdateLeadRecord = async (updatedLead: LeadFormData) => {
    const savedLead = await updateLead(updatedLead);
    setSelectedLead(savedLead);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "new": return { bg: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "New" };
      case "contacted": return { bg: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Contacted" };
      case "converted": return { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Qualified" };
      case "proposal": return { bg: "bg-purple-500/10 text-purple-600 border-purple-500/20", label: "Proposal Sent" };
      default: return { bg: "bg-muted text-muted-foreground", label: status };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 border border-border rounded-xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-background border-input focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["all", "new", "contacted", "converted", "proposal"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`h-9 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer select-none
                ${statusFilter === status
                  ? "bg-[var(--button-secondary)] text-white border-transparent"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/50"}`}
            >
              {status === "all" ? "All Pools" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Interface Grid Rendering Block Frame */}
      <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
        {error && (
          <div className="flex items-center justify-between gap-4 border-b border-border bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={refetch} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        )}
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-bold text-foreground">Lead Identity</TableHead>
              <TableHead className="font-bold text-foreground">Contact Detail</TableHead>
              <TableHead className="font-bold text-foreground">Required Service</TableHead>
              <TableHead className="font-bold text-foreground">Source</TableHead>
              <TableHead className="font-bold text-foreground">Status Flag</TableHead>
              <TableHead className="font-bold text-foreground">Ownership</TableHead>
              <TableHead className="text-right font-bold text-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Loading leads...
                </TableCell>
              </TableRow>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead, idx) => {
                const statusMeta = getStatusStyles(lead.status);
                return (
                  <TableRow key={lead._id || idx} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground tracking-tight">{lead.fullName}</span>
                        {lead.company && <span className="text-xs text-muted-foreground mt-0.5">{lead.company}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-0.5 text-xs">
                        <span className="text-foreground inline-flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" /> {lead.phone}</span>
                        {lead.email && <span className="text-muted-foreground inline-flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" /> {lead.email}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-xs font-semibold text-foreground">{lead.service}</TableCell>
                    <TableCell className="capitalize text-xs text-muted-foreground font-medium">{lead.source}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg}`}>
                        {statusMeta.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {lead.assignedTo ? (
                        <span className="text-xs font-semibold text-foreground inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md capitalize"><UserCheck className="h-3 w-3 text-muted-foreground" /> {lead.assignedTo}</span>
                      ) : (
                        <span className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-md font-medium">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Flex layout container enforces alignment and predictable item spacing */}
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Action Button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const cleanedPhone = lead.phone.replace(/\D/g, "");
                            if (cleanedPhone) {
                              window.open(`https://wa.me/${cleanedPhone}`, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer transition-colors flex items-center justify-center hover:bg-green-500/10"
                        >
                          <Image
                            src="/icons/whatsapp.svg"
                            alt="WhatsApp"
                            width={14}
                            height={14}
                          />
                        </Button>

                        {/* View Details Action Button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenDetails(lead)}
                          className="h-8 w-8 text-muted-foreground hover:text-white rounded-md cursor-pointer transition-colors flex items-center justify-center hover:bg-[var(--button-primary)]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No active leads match constraints.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out View / Edit Management Panel Context Window */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdate={handleUpdateLeadRecord}
      />
    </div>
  );
}
