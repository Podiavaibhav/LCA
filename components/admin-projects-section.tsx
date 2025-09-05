"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FolderOpen, Search, Eye, Archive, BarChart3, Calendar, User } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  metal_type: string
  status: string
  created_at: string
  created_by: string
  profiles?: { full_name: string }
}

export function AdminProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [metalFilter, setMetalFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, statusFilter, metalFilter])

  const fetchProjects = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          profiles(full_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    if (metalFilter !== "all") {
      filtered = filtered.filter((project) => project.metal_type === metalFilter)
    }

    setFilteredProjects(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMetalColor = (metal: string) => {
    switch (metal) {
      case "aluminium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "copper":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "steel":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "zinc":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading projects...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Project Management Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                Project Management
              </CardTitle>
              <CardDescription>Monitor and manage all LCA projects across the platform</CardDescription>
            </div>
            <Button variant="outline">
              <Archive className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={metalFilter} onValueChange={setMetalFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Metal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metals</SelectItem>
                <SelectItem value="aluminium">Aluminium</SelectItem>
                <SelectItem value="copper">Copper</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="zinc">Zinc</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Metal Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {project.description || "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMetalColor(project.metal_type)}>{project.metal_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{project.profiles?.full_name || "Unknown User"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/projects/${project.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No projects found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["draft", "active", "completed", "archived"].map((status) => {
                const count = projects.filter((p) => p.status === status).length
                return (
                  <div key={status} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{status}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Metal Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["aluminium", "copper", "steel", "zinc", "other"].map((metal) => {
                const count = projects.filter((p) => p.metal_type === metal).length
                return (
                  <div key={metal} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{metal}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="text-sm">
                  <p className="font-medium truncate">{project.name}</p>
                  <p className="text-muted-foreground text-xs">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(projects.map((p) => p.profiles?.full_name).filter(Boolean)))
                .slice(0, 5)
                .map((creator) => {
                  const count = projects.filter((p) => p.profiles?.full_name === creator).length
                  return (
                    <div key={creator} className="flex justify-between items-center text-sm">
                      <span className="truncate">{creator}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
