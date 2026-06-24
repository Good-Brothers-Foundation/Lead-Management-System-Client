"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadTableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
  statusCounts?: Record<string, number>;
}

const STATUS_OPTIONS = ["all", "new", "contacted", "qualified", "proposal", "converted", "unqualified"] as const;

const STATUS_LABELS: Record<string, string> = {
  all: "All Pools",
  proposal: "Proposal Sent",
  unqualified: "Unqualified",
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
};

export function LeadTableFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  statusCounts = {},
}: LeadTableFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 border border-border rounded-xl shadow-sm">
      {/* Search and Category filters container */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, category, address..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-background border-input focus-visible:ring-1"
          />
        </div>

        {/* Category Select Dropdown */}
        <div className="w-full sm:w-56">
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="h-10 bg-background border-input">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Tabs with Live Counts */}
      <div className="flex flex-wrap gap-1.5 w-full lg:w-auto justify-start lg:justify-end">
        {STATUS_OPTIONS.map((status) => {
          const count = statusCounts[status];
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer select-none
                ${
                  isActive
                    ? "bg-(--button-secondary) text-white border-transparent shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/50"
                }`}
            >
              {STATUS_LABELS[status] ?? status}
              {count !== undefined && count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black tabular-nums leading-none
                    ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}