import { LeadFormData } from "@/lib/types/lead";
import {
  formatLabel,
  getOverdueFollowUps,
  getTodayFollowUps,
  getUpcomingFollowUps,
  normalizeStatus,
  sortByFollowUpDate,
} from "@/lib/lead-insights";

export type TaskStatus = "pending" | "completed";
export type TaskPriority = "high" | "medium" | "low";

export interface LeadTask {
  id: string;
  title: string;
  leadName: string;
  company: string;
  dueDate?: string;
  dueTime?: string;
  owner: string;
  status: TaskStatus;
  priority: TaskPriority;
  source: "follow-up" | "assignment" | "closure";
}

const getLeadKey = (lead: LeadFormData) => lead._id || lead.phone;

const getPriority = (
  lead: LeadFormData,
  fallback: TaskPriority,
): TaskPriority => {
  const priority = lead.priority?.toLowerCase();

  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }

  return fallback;
};

const toFollowUpTask = (
  lead: LeadFormData,
  label: string,
  fallbackPriority: TaskPriority,
): LeadTask => ({
  id: `${getLeadKey(lead)}-${label.toLowerCase().replace(/\s+/g, "-")}`,
  title: `${label}: ${lead.contactMethod ? formatLabel(lead.contactMethod) : "Contact"} ${lead.fullName}`,
  leadName: lead.fullName,
  company: lead.category || "Individual Account",
  dueDate: lead.followUpDate,
  dueTime: lead.followUpTime,
  owner: lead.assignedTo || "Unassigned",
  status: "pending",
  priority: getPriority(lead, fallbackPriority),
  source: "follow-up",
});

export const getLeadTasks = (leads: LeadFormData[]): LeadTask[] => {
  const overdueTasks = getOverdueFollowUps(leads).map((lead) =>
    toFollowUpTask(lead, "Overdue follow-up", "high"),
  );
  const todayTasks = getTodayFollowUps(leads).map((lead) =>
    toFollowUpTask(lead, "Follow-up due today", "medium"),
  );
  const upcomingTasks = sortByFollowUpDate(getUpcomingFollowUps(leads))
    .slice(0, 8)
    .map((lead) => toFollowUpTask(lead, "Upcoming follow-up", "low"));

  const assignmentTasks = leads
    .filter((lead) => !lead.assignedTo)
    .map<LeadTask>((lead) => ({
      id: `${getLeadKey(lead)}-assignment`,
      title: `Assign owner to ${lead.fullName}`,
      leadName: lead.fullName,
      company: lead.category || "Individual Account",
      owner: "Unassigned",
      status: "pending",
      priority: normalizeStatus(lead.status) === "new" ? "medium" : "low",
      source: "assignment",
    }));

  const completedTasks = leads
    .filter((lead) => {
      const status = normalizeStatus(lead.status);
      return status === "converted" || status === "qualified";
    })
    .map<LeadTask>((lead) => ({
      id: `${getLeadKey(lead)}-closure`,
      title: `Closed lead: ${lead.fullName}`,
      leadName: lead.fullName,
      company: lead.category || "Individual Account",
      dueDate: lead.updatedAt?.slice(0, 10),
      owner: lead.assignedTo || "Unassigned",
      status: "completed",
      priority: "low",
      source: "closure",
    }));

  return [
    ...overdueTasks,
    ...todayTasks,
    ...assignmentTasks,
    ...upcomingTasks,
    ...completedTasks,
  ];
};

export const filterTasksByRoute = (tasks: LeadTask[], routeSegment: string) => {
  if (routeSegment === "pending") {
    return tasks.filter((task) => task.status === "pending");
  }

  if (routeSegment === "completed") {
    return tasks.filter((task) => task.status === "completed");
  }

  return tasks;
};
