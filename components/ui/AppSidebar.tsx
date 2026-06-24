"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import Image from "next/image";
import { SlideBarMenuItems } from "@/lib/data/SlideBarMenuItems";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { leadsApi } from "@/lib/api/leads";
import { filterFollowUpsByRoute } from "@/lib/utils";
import { LeadFormData } from "@/lib/types/lead";

/** Small pill badge used next to nav items */
function CountBadge({ count }: { count: number }) {
  if (!count || count === 0) return null;
  return (
    <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black tabular-nums leading-none shrink-0 bg-muted text-muted-foreground">
      {count}
    </span>
  );
}

export function AppSidebar() {
  const { logout, user } = useAuth();
  const router = useRouter();

  // Live sidebar counts — lightweight fetch, non-blocking
  const [allLeads, setAllLeads] = useState<LeadFormData[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    leadsApi.getAll()
      .then((res) => {
        setTotalLeads(res.count ?? res.data?.length ?? 0);
        setAllLeads(res.data || []);
      })
      .catch(() => { /* Sidebar counts are non-critical; silently skip */ });
  }, []);

  const todayCount = useMemo(() => filterFollowUpsByRoute(allLeads, "today").length, [allLeads]);
  const upcomingCount = useMemo(() => filterFollowUpsByRoute(allLeads, "upcoming").length, [allLeads]);

  /** Returns the count for a given nav item href */
  function getCountForItem(href: string): number {
    if (href === "/leads/all") return totalLeads;
    if (href === "/follow-ups/today") return todayCount;
    if (href === "/follow-ups/upcoming") return upcomingCount;
    return 0;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-red-100">
      {/* Header */}
      <SidebarHeader className="border-b p-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Lead Management System Logo"
              width={32}
              height={32}
              className="mr-2 rounded"
            />
          </div>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="p-1">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
          Main Menu
        </p>

        <SidebarMenu>
          {SlideBarMenuItems.map((menu) => (
            <Collapsible
              key={menu.title}
              defaultOpen={menu.defaultOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                     id={menu.id}
                     tooltip={menu.title}
                     className="cursor-pointer"
                  >
                    <menu.icon className="h-4 w-4" />
                    <span>{menu.title}</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-5 mt-1 border-l pl-3 group-data-[collapsible=icon]:hidden">
                    {menu.items.map((item) => {
                      const itemCount = getCountForItem(item.href);
                      return (
                        <Link
                          id={item?.id}
                          key={item?.id}
                          href={item.href}
                          className="flex h-9 w-full items-center justify-between rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <span>{item.title}</span>
                          <CountBadge count={itemCount} />
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-3">
        <div className="space-y-2">
          {user && (
            <p className="text-xs text-muted-foreground px-2 truncate group-data-[collapsible=icon]:hidden">
              {user.email}
            </p>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground group-data-[collapsible=icon]:justify-center cursor-pointer border-none bg-transparent"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
