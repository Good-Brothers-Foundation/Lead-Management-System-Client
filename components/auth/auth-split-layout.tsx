import { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface AuthSplitLayoutProps {
  children: ReactNode
  heroTitle: ReactNode
  heroDescription: string
  heroFeatures: string[]
}

export function AuthSplitLayout({
  children,
  heroTitle,
  heroDescription,
  heroFeatures,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row selection:bg-muted">
      
      {/* LEFT PANEL: Brand Hero Showcase (Visible on Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-(--button-secondary) relative p-12 flex-col justify-between overflow-hidden border-r border-border/10">
        {/* Ambient Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-muted)_0%,transparent_40%)] opacity-20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-(--button-primary)/10 rounded-full blur-3xl" />
        
        {/* Top: Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-(--button-primary) flex items-center justify-center font-black text-white text-lg shadow-lg shadow-(--button-primary)/20">
            LMS
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Lead Management System
          </span>
        </div>

        {/* Middle: Value Proposition */}
        <div className="space-y-6 max-w-md relative z-10 my-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            {heroTitle}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            {heroDescription}
          </p>
          
          {/* Feature Micro-lists */}
          <ul className="space-y-3 pt-4">
            {heroFeatures.map((text, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-(--button-primary) shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Footer Meta */}
        <div className="text-xs text-slate-500 relative z-10">
          © 2026 LMS Architecture Platform. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Clean, High-Contrast Auth Form Space */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-95 space-y-8">
          {children}
        </div>
      </div>

    </div>
  )
}