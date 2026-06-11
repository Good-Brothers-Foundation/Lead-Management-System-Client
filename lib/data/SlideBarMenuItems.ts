import { CheckSquare, LayoutDashboard, Phone, Users } from "lucide-react";

export const SlideBarMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      {
        title: "Overview",
        href: "/dashboard/overview",
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
      },
    ],
  },
  {
    title: "Leads",
    icon: Users,
    defaultOpen: true,
    items: [
      {
        title: "Add Leads",
        href: "/leads/add",
      },
      {
        title: "All Leads",
        href: "/leads/all",
      },
      {
        title: "Converted Leads",
        href: "/leads/converted",
      },
    ],
  },
  {
    title: "Follow Ups",
    icon: Phone,
    items: [
      {
        title: "Today's Follow Ups",
        href: "/follow-ups/today",
      },
      {
        title: "Upcoming Follow Ups",
        href: "/follow-ups/upcoming",
      },
    ],
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    items: [
      {
        title: "My Tasks",
        href: "/tasks/all",
      },
      {
        title: "Pending Tasks",
        href: "/tasks/pending",
      },
      {
        title: "Completed Tasks",
        href: "/tasks/completed",
      },
    ],
  },
];