import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Leaf, Upload, BarChart3, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { DataUploadSection } from "@/components/data-upload-section"
import { LCAAnalysisDashboard } from "@/components/lca-analysis-dashboard"
import { ReportGenerationSection } from "@/components/report-generation-section"

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we'll generate a few sample project IDs
  // In a real app, you'd fetch this from your database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'sample' }
  ]
}

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  // For static export, we'll handle data loading client-side
  // const supabase = await createClient()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()
  // if (!user) {
  //   redirect("/auth/login")
  // }

  // Get project details
  // const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  // if (error || !project) {
  //   redirect("/dashboard")
  // }

  // Check if user has access to this project
  // if (project.created_by !== user.id) {
  //   const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  //   if (!profile || !["admin", "auditor"].includes(profile.role)) {
  //     redirect("/dashboard")
  //   }
  // }

  // Get data uploads for this project - mock data for static export
  // const { data: uploads } = await supabase
  //   .from("data_uploads")
  //   .select("*")
  //   .eq("project_id", id)
  //   .order("created_at", { ascending: false })

  // Get LCA data for this project - mock data for static export
  // const { data: lcaData } = await supabase
  //   .from("lca_data")
  //   .select("*")
  //   .eq("project_id", id)
  //   .order("created_at", { ascending: false })

  // const { data: reports } = await supabase
  //   .from("reports")
  //   .select("*")
  //   .eq("project_id", id)
  //   .order("created_at", { ascending: false })

  // Mock data for static export
  const project = {
    id,
    name: "Sample Project",
    description: "This is a sample project for static export",
    status: "active",
    created_at: new Date().toISOString()
  }
  const uploads: any[] = []
  const lcaData: any[] = []
  const reports: any[] = []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{project.name}</h1>
                  <p className="text-xs text-muted-foreground capitalize">{project.metal_type} LCA</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {project.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Project Overview */}
        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{uploads?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Data Files</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">{lcaData?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">{reports?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Reports</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Created</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Data Upload
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data">
            <DataUploadSection projectId={id} uploads={uploads || []} />
          </TabsContent>

          <TabsContent value="analysis">
            <LCAAnalysisDashboard projectId={id} lcaData={lcaData || []} metalType={project.metal_type} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerationSection
              projectId={id}
              projectName={project.name}
              metalType={project.metal_type}
              reports={reports || []}
              lcaData={lcaData || []}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>Manage project configuration and access permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{project.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metal Type:</span>
                      <span className="capitalize">{project.metal_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="capitalize">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {project.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
