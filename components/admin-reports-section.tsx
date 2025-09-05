"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Download, Shield, Eye, Calendar, User } from "lucide-react"

interface Report {
  id: string
  title: string
  report_type: string
  digital_signature?: string
  created_at: string
  generated_by: string
  projects?: { name: string }
  profiles?: { full_name: string }
}

export function AdminReportsSection() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    filterReports()
  }, [reports, searchTerm, typeFilter])

  const fetchReports = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          projects(name),
          profiles(full_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.projects?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.report_type === typeFilter)
    }

    setFilteredReports(filtered)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "summary":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "detailed":
        return "bg-green-100 text-green-800 border-green-200"
      case "comparative":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const verifySignature = (report: Report) => {
    return report.digital_signature && report.digital_signature.length > 0
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading reports...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Report Management Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Report Management
              </CardTitle>
              <CardDescription>Monitor and audit all generated LCA assessment reports</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by title, project, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="summary">Executive Summary</SelectItem>
                <SelectItem value="detailed">Detailed Analysis</SelectItem>
                <SelectItem value="comparative">Comparative Study</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-xs text-muted-foreground">ID: {report.id.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(report.report_type)}>{report.report_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{report.projects?.name || "Unknown Project"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{report.profiles?.full_name || "Unknown User"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {verifySignature(report) ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          No Signature
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No reports found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Report Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Report Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["summary", "detailed", "comparative"].map((type) => {
                const count = reports.filter((r) => r.report_type === type).length
                return (
                  <div key={type} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{type}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Digitally Signed</span>
                <Badge variant="outline" className="text-green-600">
                  {reports.filter((r) => verifySignature(r)).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Unsigned</span>
                <Badge variant="outline" className="text-red-600">
                  {reports.filter((r) => !verifySignature(r)).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="text-sm">
                  <p className="font-medium truncate">{report.title}</p>
                  <p className="text-muted-foreground text-xs">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Generators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(reports.map((r) => r.profiles?.full_name).filter(Boolean)))
                .slice(0, 5)
                .map((creator) => {
                  const count = reports.filter((r) => r.profiles?.full_name === creator).length
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
