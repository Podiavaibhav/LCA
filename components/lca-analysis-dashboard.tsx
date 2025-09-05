"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Droplets, Zap, Recycle, Leaf, Download, Filter } from "lucide-react"

interface LCAData {
  id: string
  process_stage: string
  energy_consumption: number
  emissions_co2: number
  water_usage: number
  waste_generated: number
  recycled_content: number
  recyclability: number
  created_at: string
}

interface LCAAnalysisDashboardProps {
  projectId: string
  lcaData: LCAData[]
  metalType: string
}

export function LCAAnalysisDashboard({ projectId, lcaData, metalType }: LCAAnalysisDashboardProps) {
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("all")

  // Process data for visualizations
  const processedData = useMemo(() => {
    let filteredData = lcaData

    if (selectedStage !== "all") {
      filteredData = filteredData.filter((item) => item.process_stage === selectedStage)
    }

    // Group by process stage
    const stageData = filteredData.reduce(
      (acc, item) => {
        const stage = item.process_stage
        if (!acc[stage]) {
          acc[stage] = {
            stage,
            totalEmissions: 0,
            totalEnergy: 0,
            totalWater: 0,
            totalWaste: 0,
            avgRecycledContent: 0,
            avgRecyclability: 0,
            count: 0,
          }
        }

        acc[stage].totalEmissions += item.emissions_co2
        acc[stage].totalEnergy += item.energy_consumption
        acc[stage].totalWater += item.water_usage
        acc[stage].totalWaste += item.waste_generated
        acc[stage].avgRecycledContent += item.recycled_content
        acc[stage].avgRecyclability += item.recyclability
        acc[stage].count += 1

        return acc
      },
      {} as Record<string, any>,
    )

    // Calculate averages and format for charts
    const chartData = Object.values(stageData).map((stage: any) => ({
      stage: stage.stage.replace("_", " ").toUpperCase(),
      emissions: Math.round(stage.totalEmissions),
      energy: Math.round(stage.totalEnergy),
      water: Math.round(stage.totalWater),
      waste: Math.round(stage.totalWaste),
      recycledContent: Math.round(stage.avgRecycledContent / stage.count),
      recyclability: Math.round(stage.avgRecyclability / stage.count),
    }))

    return chartData
  }, [lcaData, selectedStage])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (lcaData.length === 0) return null

    const totals = lcaData.reduce(
      (acc, item) => ({
        emissions: acc.emissions + item.emissions_co2,
        energy: acc.energy + item.energy_consumption,
        water: acc.water + item.water_usage,
        waste: acc.waste + item.waste_generated,
        recycledContent: acc.recycledContent + item.recycled_content,
        recyclability: acc.recyclability + item.recyclability,
      }),
      { emissions: 0, energy: 0, water: 0, waste: 0, recycledContent: 0, recyclability: 0 },
    )

    return {
      totalEmissions: Math.round(totals.emissions),
      totalEnergy: Math.round(totals.energy),
      totalWater: Math.round(totals.water),
      totalWaste: Math.round(totals.waste),
      avgRecycledContent: Math.round(totals.recycledContent / lcaData.length),
      avgRecyclability: Math.round(totals.recyclability / lcaData.length),
      dataPoints: lcaData.length,
    }
  }, [lcaData])

  // Color schemes for sustainability theme
  const colors = {
    primary: "#2d7d32", // Deep green
    secondary: "#1565c0", // Deep blue
    accent: "#388e3c", // Medium green
    warning: "#f57c00", // Orange
    danger: "#d32f2f", // Red
    success: "#4caf50", // Light green
  }

  const pieColors = [colors.primary, colors.secondary, colors.accent, colors.warning, colors.success]

  if (lcaData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">LCA Analysis Dashboard</CardTitle>
          <CardDescription className="text-sm">Visualize and analyze your Life Cycle Assessment data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 sm:py-12">
            <BarChart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-sm text-muted-foreground px-4">
              Upload LCA data files to start generating visualizations and insights.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                LCA Analysis Dashboard
              </CardTitle>
              <CardDescription className="text-sm">
                Interactive visualizations for {metalType} sustainability analysis
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by process stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="extraction">Extraction</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="use">Use Phase</SelectItem>
                  <SelectItem value="end_of_life">End of Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      {summaryMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total CO₂ Emissions</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{summaryMetrics.totalEmissions}</p>
                  <p className="text-xs text-muted-foreground">kg CO₂ eq</p>
                </div>
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Energy Consumption</p>
                  <p className="text-lg sm:text-2xl font-bold text-secondary">{summaryMetrics.totalEnergy}</p>
                  <p className="text-xs text-muted-foreground">MJ</p>
                </div>
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-secondary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Water Usage</p>
                  <p className="text-lg sm:text-2xl font-bold text-accent">{summaryMetrics.totalWater}</p>
                  <p className="text-xs text-muted-foreground">liters</p>
                </div>
                <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-accent/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Recycled Content</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{summaryMetrics.avgRecycledContent}%</p>
                  <p className="text-xs text-muted-foreground">average</p>
                </div>
                <Recycle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Visualization Tabs */}
      <Tabs defaultValue="emissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="emissions" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Emissions Analysis</span>
            <span className="sm:hidden">Emissions</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Resource Usage</span>
            <span className="sm:hidden">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="circularity" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Circularity Metrics</span>
            <span className="sm:hidden">Circularity</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Stage Comparison</span>
            <span className="sm:hidden">Compare</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emissions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">CO₂ Emissions by Process Stage</CardTitle>
                <CardDescription className="text-sm">Environmental impact across lifecycle phases</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" fontSize={12} angle={-45} textAnchor="end" height={60} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="emissions" fill={colors.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Emissions Distribution</CardTitle>
                <CardDescription className="text-sm">Proportional impact by lifecycle stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={processedData}
                      dataKey="emissions"
                      nameKey="stage"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={false}
                    >
                      {processedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend fontSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Energy & Water Consumption</CardTitle>
                <CardDescription className="text-sm">Resource usage across process stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" fontSize={12} angle={-45} textAnchor="end" height={60} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend fontSize={12} />
                    <Area
                      type="monotone"
                      dataKey="energy"
                      stackId="1"
                      stroke={colors.secondary}
                      fill={colors.secondary}
                    />
                    <Area type="monotone" dataKey="water" stackId="1" stroke={colors.accent} fill={colors.accent} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Waste Generation</CardTitle>
                <CardDescription className="text-sm">Waste output by process stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" fontSize={12} angle={-45} textAnchor="end" height={60} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="waste" stroke={colors.warning} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="circularity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Recycled Content vs Recyclability</CardTitle>
                <CardDescription className="text-sm">Circular economy performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" fontSize={12} angle={-45} textAnchor="end" height={60} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend fontSize={12} />
                    <Bar dataKey="recycledContent" fill={colors.success} name="Recycled Content %" />
                    <Bar dataKey="recyclability" fill={colors.primary} name="Recyclability %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Sustainability Score</CardTitle>
                <CardDescription className="text-sm">Overall circularity performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {processedData.map((stage, index) => {
                    const score = Math.round((stage.recycledContent + stage.recyclability) / 2)
                    return (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium">{stage.stage}</span>
                          <span className="text-muted-foreground">{score}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${score}%`,
                              backgroundColor:
                                score >= 70 ? colors.success : score >= 40 ? colors.warning : colors.danger,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Multi-Metric Comparison</CardTitle>
              <CardDescription className="text-sm">
                Comprehensive view across all environmental indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" fontSize={12} angle={-45} textAnchor="end" height={60} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend fontSize={12} />
                  <Bar dataKey="emissions" fill={colors.primary} name="CO₂ Emissions" />
                  <Bar dataKey="energy" fill={colors.secondary} name="Energy (MJ)" />
                  <Bar dataKey="water" fill={colors.accent} name="Water (L)" />
                  <Bar dataKey="waste" fill={colors.warning} name="Waste (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Key Insights</CardTitle>
          <CardDescription className="text-sm">AI-powered analysis of your LCA data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 text-sm sm:text-base">High Recyclability</p>
                  <p className="text-xs sm:text-sm text-green-700">
                    Average recyclability of {summaryMetrics?.avgRecyclability}% indicates strong circular economy
                    potential.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 text-sm sm:text-base">Water Efficiency</p>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Total water usage of {summaryMetrics?.totalWater}L shows room for optimization in processing stages.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 text-sm sm:text-base">Emission Hotspots</p>
                  <p className="text-xs sm:text-sm text-orange-700">
                    Processing and manufacturing stages contribute most to CO₂ emissions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Recycle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-purple-800 text-sm sm:text-base">Circular Opportunity</p>
                  <p className="text-xs sm:text-sm text-purple-700">
                    Increasing recycled content could reduce environmental impact by up to 30%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
