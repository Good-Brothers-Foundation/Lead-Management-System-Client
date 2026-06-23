"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LeadTableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const STATUS_OPTIONS = ["all", "new", "contacted", "converted", "proposal"] as const;

export function LeadTableFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: LeadTableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 border border-border rounded-xl shadow-sm">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads or companies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 bg-background border-input focus-visible:ring-1"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusFilterChange(status)}
            className={`h-9 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer select-none
              ${statusFilter === status
                ? "bg-[var(--button-secondary)] text-white border-transparent"
                : "bg-background text-muted-foreground border-border hover:bg-muted/50"
              }`}
          >
            {status === "all" ? "All Pools" : status}
          </button>
        ))}
      </div>
    </div>
  );
}