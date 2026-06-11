"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
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

        {/* Hero Headline Stacking Context */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            Transforming How You <br />
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r"
              style={{
                backgroundImage: "linear-gradient(to right, var(--button-primary), #ff904d)",
              }}
            >
              Manage Lead Pipelines.
            </span>
          </h1>
          <p className="text-md sm:text-lg text-muted-foreground max-w-lg mx-auto font-normal leading-relaxed">
            Welcome to your central orchestration hub. Monitor conversion ratios, execute rapid database data capture logs, and manage client communication loops in one fluid workspace layout.
          </p>
        </div>

        {/* Minimalist Action Call Block */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/leads/add"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-8 font-semibold text-sm text-white rounded-md shadow-sm transition-all duration-200"
            style={{ backgroundColor: "var(--button-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--button-primary)")}
          >
            <span>Enter Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="/leads/all"
            className="inline-flex items-center justify-center w-full sm:w-auto h-12 px-8 font-semibold text-sm text-white rounded-md transition-colors border border-transparent shadow-sm"
            style={{ backgroundColor: "var(--button-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--button-secondary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--button-secondary)")}
          >
            View Active Pipelines
          </Link>
        </div>
      </div>

      {/* Elegant Outer Border Trim Decorator */}
      <div className="absolute inset-4 border border-border/40 rounded-2xl pointer-events-none hidden sm:block" />
    </div>
  );
}