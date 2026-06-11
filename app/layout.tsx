import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lead Management System",
  description: "A simple lead management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full min-w-full flex flex-col"> <TooltipProvider>
        <SidebarProvider>
          <AppSidebar/>
          <main className="flex-1">
            <div className="border-b p-1 sticky top-0 bg-[var(--sidebar)]">
            <SidebarTrigger />
            </div>

            {children}
          </main>
        </SidebarProvider>
      </TooltipProvider>
      </body>
    </html>
  );
}
