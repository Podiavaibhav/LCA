"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Users, FolderOpen, FileText, Activity, Shield, TrendingUp, Database, Clock } from "lucide-react"
import Link from "next/link"
import { AdminUsersSection } from "@/components/admin-users-section"
import { AdminProjectsSection } from "@/components/admin-projects-section"
import { AdminReportsSection } from "@/components/admin-reports-section"
import { AdminLogsSection } from "@/components/admin-logs-section"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

export default function AdminPage() {
  return (
    <ProtectedRoute requireAuth={true} requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const { user } = useAuth()

  // Mock data for static export - in production this would come from Supabase
  const totalUsers = 25
  const totalProjects = 42
  const totalReports = 67
  const totalUploads = 134
  const recentProjects: any[] = [
    { 
      id: 1, 
      name: "Steel Production LCA", 
      profiles: { full_name: "John Doe" }, 
      created_at: "2024-01-15" 
    },
    { 
      id: 2, 
      name: "Aluminum Recycling", 
      profiles: { full_name: "Jane Smith" }, 
      created_at: "2024-01-14" 
    }
  ]
  const recentReports: any[] = [
    { 
      id: 1, 
      projects: { name: "Steel Production LCA" }, 
      created_at: "2024-01-15" 
    }
  ]

  const roleStats = {
    admin: 2,
    auditor: 3,
    researcher: 20
  }

  // Mock user data
  const data = {
    user: user || {
      email: "admin@example.com",
      id: "mock-user-id"
    }
  }

  const profile = {
    full_name: user?.user_metadata?.full_name || "Admin User",
    role: user?.user_metadata?.role || "admin"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Leaf className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">System Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.full_name || data.user.email}</p>
                <Badge variant="outline" className="capitalize text-xs">
                  {profile?.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* System Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Overview</h1>
          <p className="text-muted-foreground">
            Monitor platform usage, manage users, and oversee LCA projects across the organization.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-primary">{totalUsers || 0}</p>
                  <p className="text-xs text-muted-foreground">Active accounts</p>
                </div>
                <Users className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-secondary">{totalProjects || 0}</p>
                  <p className="text-xs text-muted-foreground">LCA studies</p>
                </div>
                <FolderOpen className="w-8 h-8 text-secondary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Generated Reports</p>
                  <p className="text-2xl font-bold text-accent">{totalReports || 0}</p>
                  <p className="text-xs text-muted-foreground">Assessments</p>
                </div>
                <FileText className="w-8 h-8 text-accent/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Uploads</p>
                  <p className="text-2xl font-bold text-orange-600">{totalUploads || 0}</p>
                  <p className="text-xs text-muted-foreground">Files processed</p>
                </div>
                <Database className="w-8 h-8 text-orange-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Interface */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersSection />
          </TabsContent>

          <TabsContent value="projects">
            <AdminProjectsSection />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReportsSection />
          </TabsContent>

          <TabsContent value="logs">
            <AdminLogsSection />
          </TabsContent>
        </Tabs>

        {/* Quick Stats Sidebar */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(roleStats).map(([role, count]) => (
                <div key={role} className="flex justify-between items-center">
                  <span className="capitalize text-sm">{role}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentProjects?.slice(0, 3).map((project) => (
                <div key={project.id} className="text-sm">
                  <p className="font-medium truncate">{project.name}</p>
                  <p className="text-muted-foreground text-xs">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports?.slice(0, 3).map((report) => (
                <div key={report.id} className="text-sm">
                  <p className="font-medium truncate">{report.title}</p>
                  <p className="text-muted-foreground text-xs">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
