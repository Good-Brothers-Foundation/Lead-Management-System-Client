"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { LeadFormData } from "@/lib/types/lead";
import { useLeads } from "@/hooks/use-leads";
import LeadDetailSheet from "./LeadDetailSheet";
import { LeadTableFilters } from "./sections/lead-table-filters";
import { LeadTableRow } from "./sections/lead-table-row";
import { WhatsAppTemplateModal } from "./sections/WhatsAppTemplateModal";

export default function AllLeadsTable() {
  const { leads = [], isLoading, error, refetch, updateLead } = useLeads();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail Sheet Local Context
  const [selectedLead, setSelectedLead] = useState<LeadFormData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // WhatsApp Template Modal state
  const [whatsappLead, setWhatsappLead] = useState<LeadFormData | null>(null);
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);

  const handleOpenDetails = (lead: LeadFormData) => {
    setSelectedLead(lead);
    setIsSheetOpen(true);
  };

  const handleOpenWhatsApp = (lead: LeadFormData) => {
    setWhatsappLead(lead);
    setIsWhatsappOpen(true);
  };

  const handleUpdateLeadRecord = async (updatedLead: LeadFormData) => {
    const savedLead = await updateLead(updatedLead);
    if (savedLead) setSelectedLead(savedLead);
  };

  // Memoized query array parsing minimizes unneeded component execution cycles
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.category && lead.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  return (
    <div className="w-full space-y-6 p-4">
      {/* Control Input Area Component */}
      <LeadTableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Main Grid View Area Frame */}
      <div className="border border-border bg-card rounded-xl shadow-sm overflow-x-auto">
        {error && (
          <div className="flex items-center justify-between gap-4 border-b border-border bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{typeof error === "string" ? error : "An error occurred fetching leads."}</span>
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
              filteredLeads.map((lead, idx) => (
                <LeadTableRow
                  key={lead._id || idx} 
                  lead={lead} 
                  onViewDetails={handleOpenDetails} 
                  onWhatsAppClick={handleOpenWhatsApp}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No active leads match constraints.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Target Record Mutator Drawer context */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdate={handleUpdateLeadRecord}
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