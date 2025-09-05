"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"

// Demo credentials for easy testing
const demoUsers = [
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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showDemo, setShowDemo] = useState(false)
  const { signIn, loading, error, clearError } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const result = await signIn(email, password)
    if (result.success) {
      router.push("/dashboard")
    }
  }

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setShowDemo(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <span>←</span>
              Back to home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground text-xl">🌱</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-semibold">LCA Platform</h1>
                <p className="text-sm text-muted-foreground">Life Cycle Assessment</p>
              </div>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your LCA projects and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Demo Credentials Section */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Demo Credentials</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDemo(!showDemo)}
                  >
                    {showDemo ? 'Hide' : 'Show'} Demo Accounts
                  </Button>
                </div>
                
                {showDemo && (
                  <div className="space-y-2">
                    {demoUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-background rounded border cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => fillDemoCredentials(user.email, user.password)}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Click to use</span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">
                      Click any demo account to auto-fill credentials
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="engineer@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                  Create account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
