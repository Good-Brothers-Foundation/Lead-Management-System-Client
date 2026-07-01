"use client";

import { ArrowDownAZ, ArrowUpAZ, Clock, Clock3 } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface LeadTableFiltersProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;

  // Status
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusCounts?: Record<string, number>;

  // Category
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];

  // Service
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  services: string[];

  // Assignee
  assigneeFilter: string;
  onAssigneeFilterChange: (assignee: string) => void;
  assignees: string[];

  // Sort
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const STATUS_OPTIONS = ["all", "new", "contacted", "qualified", "proposal", "converted", "unqualified"] as const;

const STATUS_LABELS: Record<string, string> = {
  all: "All Leads",
  proposal: "Proposal Sent",
  unqualified: "Unqualified",
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
};

const SORT_OPTIONS: { value: string; label: string; icon: React.ReactNode }[] = [
  {
    value: "newest",
    label: "Newest First",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  {
    value: "oldest",
    label: "Oldest First",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  {
    value: "az",
    label: "Name A → Z",
    icon: <ArrowDownAZ className="h-3.5 w-3.5" />,
  },
  {
    value: "za",
    label: "Name Z → A",
    icon: <ArrowUpAZ className="h-3.5 w-3.5" />,
  },
];

export function LeadTableFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts = {},
  categoryFilter,
  onCategoryFilterChange,
  categories,
  serviceFilter,
  onServiceFilterChange,
  services,
  assigneeFilter,
  onAssigneeFilterChange,
  assignees,
  sortBy,
  onSortChange,
}: LeadTableFiltersProps) {
  // Build option arrays for searchable selects
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const serviceOptions = [
    { value: "all", label: "All Services" },
    ...services.map((s) => ({ value: s, label: s })),
  ];

  const assigneeOptions = [
    { value: "all", label: "All Assignees" },
    { value: "unassigned", label: "Unassigned" },
    ...assignees.map((a) => ({ value: a, label: a })),
  ];

  return (
    <div className="bg-card p-4 border border-border rounded-xl shadow-sm space-y-4">

      {/* Row 1: Search + Sort */}
      <div className="flex gap-3">
        {/* Search — grows to fill remaining space */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, category, address..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-background border-input focus-visible:ring-1 w-full"
          />
        </div>

        {/* Sort — fixed width, always visible */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-10 w-[165px] shrink-0 bg-background border-input font-medium">
            <SelectValue>
              {/* Show icon + label for selected sort */}
              <span className="inline-flex items-center gap-2">
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.icon}
                <span>{SORT_OPTIONS.find((o) => o.value === sortBy)?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="inline-flex items-center gap-2">
                  {opt.icon}
                  {opt.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Row 2: Filter dropdowns — 1 col mobile, 2 tablet, 4 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Status — plain Select (fixed 7 options) */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-10 w-full bg-background border-input font-medium">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => {
              const count = statusCounts[status];
              const label = STATUS_LABELS[status] ?? status;
              const displayLabel =
                count !== undefined && count > 0 ? `${label} (${count})` : label;
              return (
                <SelectItem key={status} value={status}>
                  {displayLabel}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Category — searchable (can be 50+ items) */}
        <SearchableSelect
          value={categoryFilter}
          onValueChange={onCategoryFilterChange}
          options={categoryOptions}
          placeholder="All Categories"
          searchPlaceholder="Search categories..."
        />

        {/* Service — searchable */}
        <SearchableSelect
          value={serviceFilter}
          onValueChange={onServiceFilterChange}
          options={serviceOptions}
          placeholder="All Services"
          searchPlaceholder="Search services..."
        />

        {/* Assignee — searchable */}
        <SearchableSelect
          value={assigneeFilter}
          onValueChange={onAssigneeFilterChange}
          options={assigneeOptions}
          placeholder="All Assignees"
          searchPlaceholder="Search assignees..."
        />

      </div>
    </div>
  );
}