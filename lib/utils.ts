import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LeadFormData } from "./types/lead";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    const value = lead[field]?.trim().toLowerCase() || "not specified";
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