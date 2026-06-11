'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/AuthContext'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row selection:bg-muted">
      
      {/* LEFT PANEL: Brand Hero Showcase (Visible on Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--button-secondary)] relative p-12 flex-col justify-between overflow-hidden border-r border-border/10">
        {/* Ambient Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-muted)_0%,_transparent_40%)] opacity-20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--button-primary)]/10 rounded-full blur-3xl" />
        
        {/* Top: Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-[var(--button-primary)] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[var(--button-primary)]/20">
            LMS
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Lead Management System
          </span>
        </div>

        {/* Middle: Value Proposition */}
        <div className="space-y-6 max-w-md relative z-10 my-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Turn raw data into <span className="text-[var(--button-primary)]">closed deals.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Execute performance tracking, pipeline routing, and behavioral analytics from a unified control deck.
          </p>
          
          {/* Feature Micro-lists */}
          <ul className="space-y-3 pt-4">
            {[
              'Real-time lead scoring & routing',
              'Automated verification workflows',
              'Enterprise-grade audit logs'
            ].map((text, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--button-primary)] shrink-0" />
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

      {/* RIGHT PANEL: Clean, High-Contrast Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-[380px] space-y-8">
          
          {/* Mobile-only Logo Header */}
          <div className="flex flex-col md:hidden items-center text-center space-y-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-md">
              LMS
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sign in to Platform</h1>
          </div>

          {/* Desktop Section Header */}
          <div className="hidden md:block space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Account Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your secure credentials below to initialize session.
            </p>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field Wrapper */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4 transition-colors group-focus-within:text-[var(--button-primary)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-input border-border/60 text-foreground placeholder:text-muted-foreground/40 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Field Wrapper */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <a 
                  href="#" 
                  className="text-xs font-medium text-[var(--button-primary)] hover:text-[var(--button-primary-hover)] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4 transition-colors group-focus-within:text-[var(--button-primary)]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-input border-border/60 text-foreground placeholder:text-muted-foreground/40 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error UI Card */}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in-50 duration-200">
                {error}
              </div>
            )}

            {/* Primary Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-medium transition-all h-11 rounded-md shadow-sm flex items-center justify-center gap-2 group/btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying identity...
                </>
              ) : (
                <>
                  Continue to Workspace
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                </>
              )}
            </Button>

          </form>

        </div>
      </div>

    </div>
  )
}