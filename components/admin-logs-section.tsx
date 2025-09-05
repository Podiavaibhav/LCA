"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Search, Download, Clock, User, Database, AlertTriangle } from "lucide-react"

interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  details?: any
  ip_address?: string
  created_at: string
  profiles?: { full_name: string }
}

export function AdminLogsSection() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, actionFilter, resourceFilter])

  const fetchLogs = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          profiles(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip_address?.includes(searchTerm),
      )
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    if (resourceFilter !== "all") {
      filtered = filtered.filter((log) => log.resource_type === resourceFilter)
    }

    setFilteredLogs(filtered)
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "bg-green-100 text-green-800 border-green-200"
      case "update":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delete":
        return "bg-red-100 text-red-800 border-red-200"
      case "login":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "logout":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "upload":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case "project":
        return <Database className="w-4 h-4" />
      case "report":
        return <Activity className="w-4 h-4" />
      case "user":
        return <User className="w-4 h-4" />
      case "upload":
        return <Download className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading audit logs...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Audit Logs Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                System Audit Logs
              </CardTitle>
              <CardDescription>
                Monitor all system activities and user actions for security and compliance
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by action, user, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="upload">Uploads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{new Date(log.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{log.profiles?.full_name || "System"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getResourceIcon(log.resource_type)}
                        <span className="text-sm capitalize">{log.resource_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{log.ip_address || "N/A"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {log.details && (
                          <p className="text-xs text-muted-foreground truncate">{JSON.stringify(log.details)}</p>
                        )}
                        {log.resource_id && (
                          <p className="text-xs text-muted-foreground">ID: {log.resource_id.slice(0, 8)}...</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No audit logs found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Action Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["create", "update", "delete", "login", "upload"].map((action) => {
                const count = logs.filter((l) => l.action === action).length
                return (
                  <div key={action} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{action}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resource Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["project", "report", "user", "upload"].map((resource) => {
                const count = logs.filter((l) => l.resource_type === resource).length
                return (
                  <div key={resource} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{resource}</span>
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
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-sm">
                  <p className="font-medium">
                    {log.action} {log.resource_type}
                  </p>
                  <p className="text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>No security alerts</span>
              </div>
              <div className="text-xs text-muted-foreground">System monitoring active</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
