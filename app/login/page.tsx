import { AuthSplitLayout } from '@/components/auth/auth-split-layout'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  const features = [
    'Real-time lead scoring & routing',
    'Automated verification workflows',
    'Enterprise-grade audit logs'
  ]

  return (
    <AuthSplitLayout
      heroTitle={<>Turn raw data into <span className="text-[var(--button-primary)]">closed deals.</span></>}
      heroDescription="Execute performance tracking, pipeline routing, and behavioral analytics from a unified control deck."
      heroFeatures={features}
    >
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

      {/* Main Authentication Form Component */}
      <LoginForm />
    </AuthSplitLayout>
  )
}