'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/AuthContext'

export function LoginForm() {
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
        id='login-btn'

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
  )
}