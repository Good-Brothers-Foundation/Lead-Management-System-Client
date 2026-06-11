import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";

export const metadata: Metadata = {
  title: "Lead Management System",
  description: "A simple lead management system.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
          <header className="sticky top-0 z-40 w-full border-b bg-sidebar p-2 flex items-center h-11 shrink-0 select-none">
            <SidebarTrigger className="relative z-50 h-8 w-8" />
          </header>
          <main className="flex-1 overflow-y-auto w-full relative">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
