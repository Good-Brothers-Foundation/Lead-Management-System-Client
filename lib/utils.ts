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