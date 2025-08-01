"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  HardDrive,
  Folder,
  File,
  Trash2,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CloudFile {
  id: string
  name: string
  type: "project" | "file" | "folder"
  size: number
  lastModified: string
  synced: boolean
  shared: boolean
  path: string
  collaborators?: number
}

interface CloudStorageProps {
  isOnline: boolean
  currentProject?: {
    name: string
    html: string
    css: string
    js: string
  }
  isDarkMode?: boolean
}

export function CloudStorage({ isOnline, currentProject, isDarkMode = true }: CloudStorageProps) {
  const [files, setFiles] = useState<CloudFile[]>([
    {
      id: "proj1",
      name: "Cyber Portfolio",
      type: "project",
      size: 2.4,
      lastModified: new Date(Date.now() - 3600000).toISOString(),
      synced: true,
      shared: true,
      path: "/projects/cyber-portfolio",
      collaborators: 3,
    },
    {
      id: "proj2",
      name: "E-commerce Dashboard",
      type: "project",
      size: 5.2,
      lastModified: new Date(Date.now() - 7200000).toISOString(),
      synced: true,
      shared: false,
      path: "/projects/ecommerce-dashboard",
    },
    {
      id: "folder1",
      name: "Templates",
      type: "folder",
      size: 15.8,
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      synced: true,
      shared: false,
      path: "/templates",
    },
    {
      id: "file1",
      name: "global-styles.css",
      type: "file",
      size: 0.3,
      lastModified: new Date(Date.now() - 1800000).toISOString(),
      synced: false,
      shared: false,
      path: "/assets/global-styles.css",
    },
  ])

  const [storageUsed, setStorageUsed] = useState(23.7)
  const [storageLimit] = useState(100)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  // Auto-sync simulation
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(() => {
      // Simulate file sync updates
      setFiles((prev) =>
        prev.map((file) => {
          if (!file.synced && Math.random() > 0.7) {
            return { ...file, synced: true }
          }
          return file
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isOnline])

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "❌ Sync Failed",
        description: "Cannot sync while offline",
        variant: "destructive",
      })
      return
    }

    setSyncStatus("syncing")
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setSyncStatus("success")
          setTimeout(() => setSyncStatus("idle"), 3000)

          toast({
            title: "☁️ Sync Complete",
            description: "All files synchronized to cloud storage",
          })

          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const handleUploadProject = () => {
    if (!currentProject || !isOnline) return

    const newFile: CloudFile = {
      id: `proj-${Date.now()}`,
      name: currentProject.name,
      type: "project",
      size: Math.random() * 5 + 1,
      lastModified: new Date().toISOString(),
      synced: false,
      shared: false,
      path: `/projects/${currentProject.name.toLowerCase().replace(/\s+/g, "-")}`,
    }

    setFiles((prev) => [newFile, ...prev])
    setStorageUsed((prev) => prev + newFile.size)

    toast({
      title: "🚀 Upload Started",
      description: `${currentProject.name} is being uploaded to cloud`,
    })

    // Simulate upload completion
    setTimeout(() => {
      setFiles((prev) => prev.map((file) => (file.id === newFile.id ? { ...file, synced: true } : file)))

      toast({
        title: "✅ Upload Complete",
        description: `${currentProject.name} saved to cloud storage`,
      })
    }, 3000)
  }

  const handleDownload = (file: CloudFile) => {
    if (!isOnline) {
      toast({
        title: "❌ Download Failed",
        description: "Cannot download while offline",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "📥 Download Started",
      description: `Downloading ${file.name}...`,
    })

    // Simulate download
    setTimeout(() => {
      toast({
        title: "✅ Download Complete",
        description: `${file.name} downloaded successfully`,
      })
    }, 2000)
  }

  const handleDelete = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    setStorageUsed((prev) => prev - file.size)

    toast({
      title: "🗑️ File Deleted",
      description: `${file.name} removed from cloud storage`,
    })
  }

  const handleShare = (file: CloudFile) => {
    const shareUrl = `${window.location.origin}/shared/${file.id}`

    navigator.clipboard.writeText(shareUrl).then(() => {
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, shared: true } : f)))

      toast({
        title: "🔗 Share Link Created",
        description: "Link copied to clipboard",
      })
    })
  }

  const formatFileSize = (size: number) => {
    return `${size.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Zap className="h-4 w-4" />
      case "folder":
        return <Folder className="h-4 w-4" />
      case "file":
        return <File className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const storagePercentage = (storageUsed / storageLimit) * 100

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"} border-b`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-blue-600" : "bg-blue-100"}`}
            >
              <Cloud className={`h-4 w-4 ${isDarkMode ? "text-white" : "text-blue-600"}`} />
            </div>
            <div>
              <h3 className={`${isDarkMode ? "text-white" : "text-slate-800"} font-semibold`}>Cloud Storage</h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                {isOnline ? "Connected" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex space-x-1">
            {syncStatus === "syncing" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
            {syncStatus === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
            {syncStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleSync}
              disabled={!isOnline || syncStatus === "syncing"}
              className={`h-8 w-8 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"}`}
            >
              <RefreshCw className={`h-4 w-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="space-y-2">
          <div
            className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} flex items-center justify-between`}
          >
            <span>Storage Used</span>
            <span>
              {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
            </span>
          </div>
          <Progress value={storagePercentage} className={`h-2 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`} />
          {storagePercentage > 80 && (
            <div className={`text-xs ${storagePercentage > 95 ? "text-red-500" : "text-yellow-500"} flex items-center`}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {storagePercentage > 95 ? "Storage almost full" : "Storage getting full"}
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {syncStatus === "syncing" && (
          <div className="mt-3 space-y-2">
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Syncing files... {Math.round(uploadProgress)}%
            </div>
            <Progress value={uploadProgress} className="h-1" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-4">
          <Button
            size="sm"
            onClick={handleUploadProject}
            disabled={!currentProject || !isOnline}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CloudUpload className="h-3 w-3 mr-2" />
            Save Project
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSync}
            disabled={!isOnline}
            className={`${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-slate-600 hover:bg-gray-50"}`}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={`${isDarkMode ? "text-slate-400" : "text-slate-600"} text-sm font-medium mb-3 flex items-center`}
        >
          <HardDrive className="h-4 w-4 mr-2" />
          Your Files ({files.length})
        </div>

        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={`${isDarkMode ? "bg-slate-700/50 hover:bg-slate-700 border-slate-600" : "bg-white hover:bg-gray-50 border-gray-200"} rounded-lg p-3 border transition-colors duration-200 group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      file.type === "project"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : file.type === "folder"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-gray-500 to-slate-500"
                    }`}
                  >
                    {getFileIcon(file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`${isDarkMode ? "text-white" : "text-slate-800"} text-sm font-medium truncate`}>
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        {!file.synced && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Syncing..." />
                        )}
                        {file.synced && <CheckCircle className="h-3 w-3 text-green-500" title="Synced" />}
                        {file.shared && <Share2 className="h-3 w-3 text-blue-500" title="Shared" />}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className={`${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {formatFileSize(file.size)}
                      </span>
                      <span className={`${isDarkMode ? "text-slate-500" : "text-slate-400"} flex items-center`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(file.lastModified)}
                      </span>
                      {file.collaborators && (
                        <Badge variant="secondary" className="text-xs">
                          {file.collaborators} collaborators
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file)}
                    disabled={!isOnline}
                    className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-600" : "text-slate-500 hover:text-slate-700 hover:bg-gray-200"}`}
                  >
                    <CloudDownload className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShare(file)}
                    className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-600" : "text-slate-500 hover:text-slate-700 hover:bg-gray-200"}`}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(file.id)}
                    className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-600" : "text-slate-500 hover:text-red-500 hover:bg-gray-200"}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12">
            <Cloud className={`h-16 w-16 ${isDarkMode ? "text-slate-600" : "text-gray-300"} mx-auto mb-4`} />
            <h3 className={`${isDarkMode ? "text-slate-500" : "text-gray-500"} text-lg font-medium mb-2`}>
              No files in cloud storage
            </h3>
            <p className={`${isDarkMode ? "text-slate-600" : "text-gray-400"} text-sm mb-6`}>
              Upload your first project to get started
            </p>
            <Button
              onClick={handleUploadProject}
              disabled={!currentProject || !isOnline}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              Upload Current Project
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
