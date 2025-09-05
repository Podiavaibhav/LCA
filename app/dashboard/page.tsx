"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, Building2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const mockProfile = {
    full_name: user?.user_metadata?.full_name || user?.email || "Demo User",
    role: user?.user_metadata?.role || "researcher",
    organization: user?.user_metadata?.organization || "Demo Organization",
  }

  const mockProjects = [
    {
      id: "1",
      name: "Aluminum Recycling Study",
      description: "Life cycle assessment of aluminum recycling processes",
      status: "active",
      metal_type: "aluminum",
      created_at: "2024-01-15",
    },
    {
      id: "2",
      name: "Copper Mining Impact",
      description: "Environmental impact analysis of copper extraction",
      status: "completed",
      metal_type: "copper",
      created_at: "2024-01-10",
    },
  ]

  const isAdmin = mockProfile?.role === "admin" || mockProfile?.role === "auditor"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">🌱</div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">LCA Platform</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {mockProfile?.full_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                  <Building2 className="w-3 h-3" />
                  {mockProfile?.role} • {mockProfile?.organization}
                </p>
              </div>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="hidden sm:flex bg-transparent">
                  <Link href="/admin">🛡️ Admin</Link>
                </Button>
              )}
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="sm:hidden bg-transparent">
                  <Link href="/admin">🛡️</Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex bg-transparent"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="sm:hidden bg-transparent"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {mockProfile?.full_name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your Life Cycle Assessment projects and generate sustainability reports.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/dashboard/projects/new">
            <Card className="border-2 hover:border-primary/20 transition-colors cursor-pointer">
              <CardHeader className="p-3 sm:pb-3 sm:px-6 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    ➕
                  </div>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-sm sm:text-base">New Project</CardTitle>
                    <CardDescription className="text-xs hidden sm:block">Start LCA study</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Card className="border-2 hover:border-secondary/20 transition-colors cursor-pointer">
            <CardHeader className="p-3 sm:pb-3 sm:px-6 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  📊
                </div>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-sm sm:text-base">Analytics</CardTitle>
                  <CardDescription className="text-xs hidden sm:block">View insights</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/20 transition-colors cursor-pointer">
            <CardHeader className="p-3 sm:pb-3 sm:px-6 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  📄
                </div>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-sm sm:text-base">Reports</CardTitle>
                  <CardDescription className="text-xs hidden sm:block">Generate docs</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {isAdmin ? (
            <Link href="/admin">
              <Card className="border-2 hover:border-red-200 transition-colors cursor-pointer">
                <CardHeader className="p-3 sm:pb-3 sm:px-6 sm:pt-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      🛡️
                    </div>
                    <div className="text-center sm:text-left">
                      <CardTitle className="text-sm sm:text-base">Admin Panel</CardTitle>
                      <CardDescription className="text-xs hidden sm:block">System management</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card className="border-2 hover:border-muted-foreground/20 transition-colors cursor-pointer">
              <CardHeader className="p-3 sm:pb-3 sm:px-6 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                    ⚙️
                  </div>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-sm sm:text-base">Settings</CardTitle>
                    <CardDescription className="text-xs hidden sm:block">Manage account</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Recent Projects</h2>
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/dashboard/projects/new">➕ New Project</Link>
              </Button>
            </div>

            {mockProjects && mockProjects.length > 0 ? (
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg">{project.name}</CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            {project.description || "No description provided"}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="capitalize">{project.metal_type}</span>
                          <span>•</span>
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto bg-transparent">
                          <Link href={`/dashboard/projects/${project.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    ➕
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                    Create your first LCA project to start analyzing environmental impact.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/dashboard/projects/new">➕ Create Project</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium text-sm sm:text-base">{mockProfile?.organization || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Role</p>
                  <Badge variant="outline" className="capitalize text-xs">
                    {mockProfile?.role || "engineer"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Member since</p>
                  <p className="font-medium text-sm sm:text-base">
                    {new Date(mockUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Total Projects</span>
                  <span className="font-semibold text-sm sm:text-base">{mockProjects?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Active Studies</span>
                  <span className="font-semibold text-sm sm:text-base">
                    {mockProjects?.filter((p) => p.status === "active").length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Completed</span>
                  <span className="font-semibold text-sm sm:text-base">
                    {mockProjects?.filter((p) => p.status === "completed").length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <PWAInstallPrompt />
    </div>
  )
}
