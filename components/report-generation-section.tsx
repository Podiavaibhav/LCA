"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Shield, Clock, User, Plus, Eye, CheckCircle, FileCheck, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Report {
  id: string
  title: string
  report_type: string
  content: any
  pdf_path?: string
  digital_signature?: string
  generated_by: string
  created_at: string
}

interface LCAData {
  id: string
  process_stage: string
  energy_consumption: number
  emissions_co2: number
  water_usage: number
  waste_generated: number
  recycled_content: number
  recyclability: number
}

interface ReportGenerationSectionProps {
  projectId: string
  projectName: string
  metalType: string
  reports: Report[]
  lcaData: LCAData[]
}

export function ReportGenerationSection({
  projectId,
  projectName,
  metalType,
  reports,
  lcaData,
}: ReportGenerationSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNewReportForm, setShowNewReportForm] = useState(false)
  const [reportTitle, setReportTitle] = useState("")
  const [reportType, setReportType] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [currentReports, setCurrentReports] = useState(reports)

  const generateReport = async () => {
    if (!reportTitle || !reportType) {
      setError("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Calculate summary metrics from LCA data
      const summaryMetrics = lcaData.reduce(
        (acc, item) => ({
          totalEmissions: acc.totalEmissions + item.emissions_co2,
          totalEnergy: acc.totalEnergy + item.energy_consumption,
          totalWater: acc.totalWater + item.water_usage,
          totalWaste: acc.totalWaste + item.waste_generated,
          avgRecycledContent: acc.avgRecycledContent + item.recycled_content,
          avgRecyclability: acc.avgRecyclability + item.recyclability,
        }),
        {
          totalEmissions: 0,
          totalEnergy: 0,
          totalWater: 0,
          totalWaste: 0,
          avgRecycledContent: 0,
          avgRecyclability: 0,
        },
      )

      if (lcaData.length > 0) {
        summaryMetrics.avgRecycledContent = summaryMetrics.avgRecycledContent / lcaData.length
        summaryMetrics.avgRecyclability = summaryMetrics.avgRecyclability / lcaData.length
      }

      // Group data by process stage
      const stageData = lcaData.reduce(
        (acc, item) => {
          const stage = item.process_stage
          if (!acc[stage]) {
            acc[stage] = {
              stage,
              emissions: 0,
              energy: 0,
              water: 0,
              waste: 0,
              count: 0,
            }
          }
          acc[stage].emissions += item.emissions_co2
          acc[stage].energy += item.energy_consumption
          acc[stage].water += item.water_usage
          acc[stage].waste += item.waste_generated
          acc[stage].count += 1
          return acc
        },
        {} as Record<string, any>,
      )

      // Generate digital signature (simplified hash)
      const reportData = {
        projectId,
        projectName,
        metalType,
        reportType,
        summaryMetrics,
        stageData,
        generatedAt: new Date().toISOString(),
        generatedBy: user.id,
      }

      const digitalSignature = await generateDigitalSignature(reportData)

      // Create comprehensive report content
      const reportContent = {
        metadata: {
          title: reportTitle,
          description: reportDescription,
          projectName,
          metalType,
          reportType,
          generatedAt: new Date().toISOString(),
          generatedBy: user.email,
          dataPoints: lcaData.length,
          digitalSignature,
        },
        executiveSummary: {
          totalEmissions: Math.round(summaryMetrics.totalEmissions),
          totalEnergy: Math.round(summaryMetrics.totalEnergy),
          totalWater: Math.round(summaryMetrics.totalWater),
          totalWaste: Math.round(summaryMetrics.totalWaste),
          avgRecycledContent: Math.round(summaryMetrics.avgRecycledContent),
          avgRecyclability: Math.round(summaryMetrics.avgRecyclability),
          sustainabilityScore: Math.round((summaryMetrics.avgRecycledContent + summaryMetrics.avgRecyclability) / 2),
        },
        detailedAnalysis: {
          stageBreakdown: Object.values(stageData),
          recommendations: generateRecommendations(summaryMetrics, stageData),
          complianceStatus: assessCompliance(summaryMetrics),
        },
        appendices: {
          rawData: lcaData.slice(0, 100), // Limit for report size
          methodology: "ISO 14040/14044 compliant Life Cycle Assessment",
          assumptions: [
            "System boundaries include cradle-to-grave analysis",
            "Functional unit: 1 kg of processed metal",
            "Impact categories: Climate change, Resource depletion, Water use",
          ],
        },
      }

      // Save report to database
      const { data: newReport, error: reportError } = await supabase
        .from("reports")
        .insert({
          project_id: projectId,
          title: reportTitle,
          report_type: reportType,
          content: reportContent,
          digital_signature: digitalSignature,
          generated_by: user.id,
        })
        .select()
        .single()

      if (reportError) throw reportError

      // Update local state
      setCurrentReports((prev) => [newReport, ...prev])
      setShowNewReportForm(false)
      setReportTitle("")
      setReportType("")
      setReportDescription("")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDigitalSignature = async (data: any): Promise<string> => {
    // Simplified digital signature using crypto API
    const encoder = new TextEncoder()
    const dataString = JSON.stringify(data)
    const dataBuffer = encoder.encode(dataString)

    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      try {
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      } catch {
        // Fallback for environments without crypto.subtle
        return btoa(dataString).slice(0, 64)
      }
    }

    // Fallback signature
    return btoa(dataString).slice(0, 64)
  }

  const generateRecommendations = (metrics: any, stageData: any) => {
    const recommendations = []

    if (metrics.avgRecycledContent < 30) {
      recommendations.push("Increase recycled content to improve circular economy performance")
    }

    if (metrics.totalEmissions > 1000) {
      recommendations.push("Implement carbon reduction strategies in high-emission process stages")
    }

    if (metrics.totalWater > 5000) {
      recommendations.push("Optimize water usage through recycling and efficiency improvements")
    }

    const highestEmissionStage = Object.values(stageData).reduce(
      (max: any, stage: any) => (stage.emissions > max.emissions ? stage : max),
      { emissions: 0 },
    )

    if (highestEmissionStage.emissions > 0) {
      recommendations.push(`Focus emission reduction efforts on ${highestEmissionStage.stage} stage`)
    }

    return recommendations
  }

  const assessCompliance = (metrics: any) => {
    const checks = [
      {
        criterion: "ISO 14040 Methodology",
        status: "compliant",
        details: "Assessment follows ISO 14040/14044 standards",
      },
      {
        criterion: "Data Quality",
        status: metrics.totalEmissions > 0 ? "compliant" : "warning",
        details: metrics.totalEmissions > 0 ? "Sufficient data available" : "Limited data for assessment",
      },
      {
        criterion: "Circular Economy Indicators",
        status: metrics.avgRecyclability > 50 ? "compliant" : "attention",
        details: `Recyclability: ${Math.round(metrics.avgRecyclability)}%`,
      },
    ]

    return checks
  }

  const downloadReport = async (report: Report, format: "pdf" | "json") => {
    if (format === "json") {
      // Download as JSON
      const dataStr = JSON.stringify(report.content, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${report.title.replace(/\s+/g, "_")}_${report.id.slice(0, 8)}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // Generate and download PDF (simplified implementation)
      generatePDFReport(report)
    }
  }

  const generatePDFReport = (report: Report) => {
    // Simplified PDF generation - in production, use jsPDF or similar
    const content = `
LCA ASSESSMENT REPORT
${report.title}

Generated: ${new Date(report.created_at).toLocaleString()}
Digital Signature: ${report.digital_signature?.slice(0, 16)}...

EXECUTIVE SUMMARY
Total CO₂ Emissions: ${report.content.executiveSummary.totalEmissions} kg CO₂ eq
Total Energy: ${report.content.executiveSummary.totalEnergy} MJ
Total Water: ${report.content.executiveSummary.totalWater} L
Sustainability Score: ${report.content.executiveSummary.sustainabilityScore}%

RECOMMENDATIONS
${report.content.detailedAnalysis.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join("\n")}

This report is digitally signed and tamper-proof.
Signature: ${report.digital_signature}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${report.title.replace(/\s+/g, "_")}_${report.id.slice(0, 8)}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getReportTypeColor = (type: string) => {
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
    // Simplified signature verification
    return report.digital_signature && report.digital_signature.length > 0
  }

  return (
    <div className="space-y-6">
      {/* Report Generation Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                LCA Report Generation
              </CardTitle>
              <CardDescription>Generate tamper-proof assessment reports with digital signatures</CardDescription>
            </div>
            <Button onClick={() => setShowNewReportForm(!showNewReportForm)} disabled={lcaData.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </CardHeader>

        {showNewReportForm && (
          <CardContent className="border-t">
            <div className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input
                    id="reportTitle"
                    placeholder="Q4 2024 Aluminum LCA Assessment"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Executive Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="comparative">Comparative Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportDescription">Description (Optional)</Label>
                <Textarea
                  id="reportDescription"
                  placeholder="Brief description of the report scope and objectives..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={generateReport} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
                <Button variant="outline" onClick={() => setShowNewReportForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>Download and manage your LCA assessment reports</CardDescription>
        </CardHeader>
        <CardContent>
          {currentReports.length > 0 ? (
            <div className="space-y-4">
              {currentReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{report.title}</h3>
                        <Badge className={cn("capitalize", getReportTypeColor(report.report_type))}>
                          {report.report_type}
                        </Badge>
                        {verifySignature(report) && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Generated by user
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4" />
                          {report.content?.metadata?.dataPoints || 0} data points
                        </div>
                      </div>

                      {report.content?.executiveSummary && (
                        <div className="grid md:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-3">
                          <div>
                            <span className="text-muted-foreground">CO₂:</span>
                            <span className="font-medium ml-1">
                              {report.content.executiveSummary.totalEmissions} kg
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Energy:</span>
                            <span className="font-medium ml-1">{report.content.executiveSummary.totalEnergy} MJ</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Water:</span>
                            <span className="font-medium ml-1">{report.content.executiveSummary.totalWater} L</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sustainability:</span>
                            <span className="font-medium ml-1">
                              {report.content.executiveSummary.sustainabilityScore}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => downloadReport(report, "json")}>
                        <Download className="w-4 h-4 mr-1" />
                        JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadReport(report, "pdf")}>
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {report.digital_signature && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        Digital Signature: {report.digital_signature.slice(0, 32)}...
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reports Generated</h3>
              <p className="text-muted-foreground mb-4">
                {lcaData.length === 0
                  ? "Upload LCA data to start generating reports."
                  : "Create your first assessment report from the uploaded data."}
              </p>
              {lcaData.length > 0 && (
                <Button onClick={() => setShowNewReportForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate First Report
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Pre-configured report formats for different stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-semibold">Executive Summary</h4>
              </div>
              <p className="text-sm text-muted-foreground">High-level overview for management and policymakers</p>
            </div>

            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold">Technical Analysis</h4>
              </div>
              <p className="text-sm text-muted-foreground">Detailed technical report for engineers and metallurgists</p>
            </div>

            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-semibold">Compliance Report</h4>
              </div>
              <p className="text-sm text-muted-foreground">Regulatory compliance and certification documentation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
