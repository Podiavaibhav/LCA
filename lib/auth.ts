import { createClient } from './supabase/client'

export interface User {
  id: string
  email: string
  full_name?: string
  role?: string
  organization?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

// Demo users for testing (these would be in your Supabase database in production)
export const demoUsers = [
  {
    email: "admin@lcaplatform.com",
    password: "admin123",
    role: "admin",
    full_name: "Admin User",
    organization: "LCA Platform"
  },
  {
    email: "auditor@lcaplatform.com", 
    password: "auditor123",
    role: "auditor",
    full_name: "Auditor User",
    organization: "LCA Platform"
  },
  {
    email: "researcher@university.edu",
    password: "research123", 
    role: "researcher",
    full_name: "Research User",
    organization: "University Research Lab"
  }
]

export class AuthService {
  private supabase = createClient()

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return { user: data.user, error: null }
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      }
    }
  }

  async signUp(userData: {
    email: string
    password: string
    fullName: string
    organization: string
    role: string
  }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            organization: userData.organization,
            role: userData.role,
          }
        }
      })
      
      if (error) throw error
      
      return { user: data.user, error: null }
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      }
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Failed to get user' 
      }
    }
  }

  onAuthStateChange(callback: (user: any) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })
  }
}

export const authService = new AuthService()
