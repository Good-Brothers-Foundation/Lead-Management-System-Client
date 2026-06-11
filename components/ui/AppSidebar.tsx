"use client";

import Link from "next/link";
import {
  ChevronDown,
  LogOut,
} from "lucide-react";

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

export function AppSidebar() {
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <Sidebar collapsible="icon" className="border-r bg-red-100">
      {/* Header */}
      <SidebarHeader className="border-b p-3">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
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
                    {menu.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex h-9 w-full items-center rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {item.title}
                      </Link>
                    ))}
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
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground group-data-[collapsible=icon]:justify-center"
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