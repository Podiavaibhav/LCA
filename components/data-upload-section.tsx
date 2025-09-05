"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, File, CheckCircle, AlertCircle, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataUpload {
  id: string
  filename: string
  file_type: string
  file_size: number
  status: string
  created_at: string
}

interface DataUploadSectionProps {
  projectId: string
  uploads: DataUpload[]
}

export function DataUploadSection({ projectId, uploads }: DataUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentUploads, setCurrentUploads] = useState(uploads)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      const supabase = createClient()

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        for (const file of acceptedFiles) {
          // Validate file type
          const fileExtension = file.name.split(".").pop()?.toLowerCase()
          if (!["csv", "xlsx", "xls", "json"].includes(fileExtension || "")) {
            throw new Error(`Unsupported file type: ${fileExtension}`)
          }

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90))
          }, 100)

          // Upload file to Supabase Storage
          const fileName = `${Date.now()}-${file.name}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("lca-data")
            .upload(`projects/${projectId}/${fileName}`, file)

          clearInterval(progressInterval)

          if (uploadError) throw uploadError

          // Record upload in database
          const { data: recordData, error: recordError } = await supabase
            .from("data_uploads")
            .insert({
              project_id: projectId,
              filename: file.name,
              file_type: fileExtension === "xlsx" || fileExtension === "xls" ? "excel" : fileExtension,
              file_size: file.size,
              upload_path: uploadData.path,
              uploaded_by: user.id,
              status: "completed",
            })
            .select()
            .single()

          if (recordError) throw recordError

          // Update local state
          setCurrentUploads((prev) => [recordData, ...prev])
          setUploadProgress(100)

          // Process the file data (simulate)
          await processUploadedFile(file, recordData.id, projectId)
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Upload failed")
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [projectId],
  )

  const processUploadedFile = async (file: File, uploadId: string, projectId: string) => {
    const supabase = createClient()

    try {
      // Read file content
      const text = await file.text()
      let data: any[] = []

      if (file.name.endsWith(".json")) {
        data = JSON.parse(text)
      } else if (file.name.endsWith(".csv")) {
        // Simple CSV parsing (in production, use a proper CSV parser)
        const lines = text.split("\n")
        const headers = lines[0].split(",")
        data = lines.slice(1).map((line) => {
          const values = line.split(",")
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim()
            return obj
          }, {})
        })
      }

      // Process and insert LCA data
      for (const row of data.slice(0, 10)) {
        // Limit to first 10 rows for demo
        await supabase.from("lca_data").insert({
          project_id: projectId,
          upload_id: uploadId,
          process_stage: row.process_stage || "processing",
          material_input: row.material_input ? JSON.parse(row.material_input) : {},
          energy_consumption: Number.parseFloat(row.energy_consumption) || 0,
          emissions_co2: Number.parseFloat(row.emissions_co2) || 0,
          water_usage: Number.parseFloat(row.water_usage) || 0,
          waste_generated: Number.parseFloat(row.waste_generated) || 0,
          recycled_content: Number.parseFloat(row.recycled_content) || 0,
          recyclability: Number.parseFloat(row.recyclability) || 0,
        })
      }
    } catch (error) {
      console.error("Error processing file:", error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "application/json": [".json"],
    },
    disabled: isUploading,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <File className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              isUploading && "pointer-events-none opacity-50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload LCA Data Files</h3>
            <p className="text-muted-foreground mb-4">Drag and drop your files here, or click to browse</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">CSV</Badge>
              <Badge variant="outline">Excel</Badge>
              <Badge variant="outline">JSON</Badge>
            </div>
            {isUploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>Manage your uploaded LCA data files and view processing status</CardDescription>
        </CardHeader>
        <CardContent>
          {currentUploads.length > 0 ? (
            <div className="space-y-3">
              {currentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <p className="font-medium">{upload.filename}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{upload.file_type}</span>
                        <span>{formatFileSize(upload.file_size)}</span>
                        <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("capitalize", getStatusColor(upload.status))}>{upload.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No files uploaded yet</h3>
              <p className="text-muted-foreground">Upload your first LCA data file to get started with analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
