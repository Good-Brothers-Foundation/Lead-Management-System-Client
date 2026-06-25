"use client";

import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, List, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { LeadFormData } from "@/lib/types/lead";
import { useLeads } from "@/hooks/use-leads";
import LeadDetailSheet from "./LeadDetailSheet";
import { LeadTableFilters } from "./sections/lead-table-filters";
import { LeadTableRow } from "./sections/lead-table-row";
import { WhatsAppTemplateModal } from "./sections/WhatsAppTemplateModal";
import { LeadKanbanBoard } from "./sections/LeadKanbanBoard";

export default function AllLeadsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounced search state to prevent server query spam
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setPage(1);
  };

  // Fetch leads with server-side pagination and filters
  const {
    leads = [],
    categories: hookCategories = [],
    statusCounts = {},
    isLoading,
    error,
    refetch,
    updateLead,
    pagination,
  } = useLeads({
    page,
    limit,
    status: statusFilter,
    category: categoryFilter,
    search: debouncedSearch,
  });

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

  // Dynamically extract unique categories from loaded leads list if not returned from hook
  const categories = useMemo(() => {
    if (hookCategories && hookCategories.length > 0) {
      return hookCategories;
    }
    const cats = new Set<string>();
    leads.forEach((lead) => {
      if (lead.category && lead.category.trim() !== "") {
        cats.add(lead.category.trim());
      }
    });
    return Array.from(cats).sort();
  }, [leads, hookCategories]);

  // Memoized query array parsing (fallback to client filtering only when pagination metadata is absent)
  const filteredLeads = useMemo(() => {
    if (pagination) {
      return leads;
    }
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.category && lead.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.address && lead.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.service && lead.service.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.source && lead.source.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      
      const matchesCategory = categoryFilter === "all" || (lead.category && lead.category.trim() === categoryFilter);

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [leads, searchQuery, statusFilter, categoryFilter, pagination]);

  const startItem = pagination && pagination.total > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0;
  const endItem = pagination ? Math.min(pagination.currentPage * pagination.limit, pagination.total) : leads.length;

  const getPageNumbers = () => {
    if (!pagination) return [];
    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full space-y-6 p-4">
      {/* Control Input Area Component */}
      <LeadTableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        categories={categories}
        statusCounts={statusCounts}
      />

      {/* View Mode Toggle Switch Row */}
      <div className="flex justify-end items-center gap-2">
        <Button
          type="button"
          variant={viewMode === "table" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="h-8.5 gap-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border-border/80"
        >
          <List className="h-3.5 w-3.5" />
          Table View
        </Button>
        <Button
          type="button"
          variant={viewMode === "kanban" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setViewMode("kanban")}
          className="h-8.5 gap-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border-border/80"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Kanban Board
        </Button>
      </div>

      {viewMode === "table" ? (
        /* Main Grid View Area Frame */
        <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
          {error && (
            <div className="flex items-center justify-between gap-4 border-b border-border bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span>{typeof error === "string" ? error : "An error occurred fetching leads."}</span>
              <Button type="button" variant="outline" size="sm" onClick={refetch} className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          )}

          {/*
            overflow-x-auto stays as a safety net for very small viewports;
            table-fixed below is what actually stops columns from
            expanding to fit their content.
          */}
          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="font-bold text-foreground w-[20%]">Lead Identity</TableHead>
                  <TableHead className="font-bold text-foreground w-[16%]">Contact Detail</TableHead>
                  <TableHead className="font-bold text-foreground w-[14%]">Has Website</TableHead>
                  <TableHead className="font-bold text-foreground w-[14%]">Required Service</TableHead>
                  <TableHead className="font-bold text-foreground w-[12%]">Source</TableHead>
                  <TableHead className="font-bold text-foreground w-[12%]">Status Flag</TableHead>
                  <TableHead className="font-bold text-foreground w-[14%]">Assigned To</TableHead>
                  <TableHead className="text-right font-bold text-foreground w-[10%]">Action</TableHead>
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
                    const leadId = lead._id || "";
                    return (
                      <LeadTableRow
                        key={leadId || idx} 
                        lead={lead} 
                        onViewDetails={handleOpenDetails} 
                        onWhatsAppClick={handleOpenWhatsApp}
                      />
                    );
                  })
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

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border bg-muted/20 px-6 py-4">
              <p className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{startItem}</span> to{" "}
                <span className="font-bold text-foreground">{endItem}</span> of{" "}
                <span className="font-bold text-foreground">{pagination.total}</span> leads
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg cursor-pointer border-border hover:bg-muted/80 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === "...") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-xs text-muted-foreground font-medium select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <Button
                      key={`page-${pageNum}`}
                      type="button"
                      variant={page === pageNum ? "secondary" : "outline"}
                      className={`h-8 w-8 text-xs font-bold rounded-lg cursor-pointer border-border
                        ${page === pageNum ? "bg-(--button-secondary) text-white hover:bg-(--button-secondary)/90" : "hover:bg-muted/80"}`}
                      onClick={() => setPage(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg cursor-pointer border-border hover:bg-muted/80 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <LeadKanbanBoard
          leads={filteredLeads}
          onViewDetails={handleOpenDetails}
          onUpdateLead={handleUpdateLeadRecord}
        />
      )}

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