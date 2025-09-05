'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requiredRole
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push('/auth/login')
    } else if (!loading && user && requiredRole) {
      // Check if user has the required role
      const userRole = user.user_metadata?.role
      if (userRole !== requiredRole && !['admin', 'auditor'].includes(userRole || '')) {
        router.push('/dashboard') // Redirect to dashboard if insufficient permissions
      }
    }
  }, [user, loading, router, requireAuth, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
