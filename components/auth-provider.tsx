'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, type User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check current user on mount
    const checkUser = async () => {
      const { user, error } = await authService.getCurrentUser()
      if (error) {
        setError(error)
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    checkUser()

    // Listen for auth state changes
    const subscription = authService.onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })

    return () => {
      subscription.data.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    const { user, error } = await authService.signIn(email, password)
    
    if (error) {
      setError(error)
      setLoading(false)
      return { success: false, error }
    }
    
    setUser(user)
    setLoading(false)
    return { success: true }
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await authService.signOut()
    
    if (error) {
      setError(error)
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
