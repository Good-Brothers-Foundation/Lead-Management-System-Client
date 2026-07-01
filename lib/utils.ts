import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LeadFormData } from "./types/lead";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a human-readable relative time string.
 * e.g. "just now", "5 minutes ago", "2 hours ago", "3 days ago", "Apr 15"
 */
export function timeAgo(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function filterFollowUpsByRoute(leads: LeadFormData[], routeSegment: string) {
  const todayStr = getLocalDateString(new Date());

  return leads.filter((lead) => {
    if (!lead.followUpDate) return false;

    if (routeSegment === "today") {
      return lead.followUpDate === todayStr;
    }
    
    if (routeSegment === "upcoming") {
      return lead.followUpDate > todayStr;
    }

    return false;
  });
}

export const getCountsByField = (
  leads: LeadFormData[],
  field: "source" | "assignedTo" | "budget"
): Record<string, number> => {
  return leads.reduce<Record<string, number>>((counts, lead) => {
    let value = lead[field]?.trim().toLowerCase() || "not specified";
    if (field === "source" && value === "google") {
      value = "google-maps";
    }
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
};

export const generateTrendData = (leads: LeadFormData[]) => {
  const data: Record<string, { date: string; leads: number; conversions: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    data[dateStr] = { date: dateStr, leads: 0, conversions: 0 };
  }

  leads.forEach((lead) => {
    if (lead.followUpDate) {
      const followUpDateObj = new Date(lead.followUpDate);
      const dateStr = followUpDateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (data[dateStr]) {
        data[dateStr].leads += 1;
        if (lead.status === "qualified" || lead.status === "converted") {
          data[dateStr].conversions += 1;
        }
      }
    }
  });

  return Object.values(data);
};