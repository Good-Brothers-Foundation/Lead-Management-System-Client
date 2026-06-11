"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden select-none">
      
      {/* Background Subtle Tech-Grid Mesh Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="relative max-w-2xl text-center space-y-8 z-10">
        
        {/* Subtle Pill Badge Header Component Context */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card shadow-sm text-xs font-medium tracking-wide text-muted-foreground animate-fade-in">
          <Sparkles className="h-3 w-3 text-[#fd6102]" style={{ color: "var(--button-primary)" }} />
          <span>System Engine Active v1.0.0</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Lead Management</h1>
          <p className="text-lg text-muted-foreground">
            Manage your leads efficiently and effectively
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
