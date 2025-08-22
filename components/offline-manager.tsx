"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Trash2, Clock, HardDrive, Wifi, WifiOff, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  name: string
  html: string
  css: string
  js: string
  lastModified?: string
}

interface OfflineManagerProps {
  isOnline: boolean
  currentProject: Project
  isDarkMode?: boolean
}

export function OfflineManager({ isOnline, currentProject, isDarkMode = true }: OfflineManagerProps) {
  const [offlineProjects, setOfflineProjects] = useState<Project[]>([])
  const [storageUsed, setStorageUsed] = useState(0)
  const [maxStorage] = useState(5120) // 5MB limit
  const [isExpanded, setIsExpanded] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const { toast } = useToast()

  useEffect(() => {
    loadOfflineProjects()
    calculateStorageUsage()
  }, [])

  useEffect(() => {
    if (!isOnline) {
      saveToOfflineStorage(currentProject)
    }
  }, [currentProject, isOnline])

  const loadOfflineProjects = () => {
    try {
      const projects = JSON.parse(localStorage.getItem("devmirror-offline-projects") || "[]")
      setOfflineProjects(projects)
    } catch (error) {
      console.error("Error loading offline projects:", error)
    }
  }

  const calculateStorageUsage = () => {
    let total = 0
    for (const key in localStorage) {
      if (key.startsWith("devmirror-")) {
        total += localStorage[key].length
      }
    }
    setStorageUsed(Math.round(total / 1024)) // Convert to KB
  }

  const saveToOfflineStorage = (project: Project) => {
    try {
      const projects = JSON.parse(localStorage.getItem("devmirror-offline-projects") || "[]")
      const existingIndex = projects.findIndex((p: Project) => p.name === project.name)

      const projectWithTimestamp = {
        ...project,
        lastModified: new Date().toISOString(),
      }

      if (existingIndex >= 0) {
        projects[existingIndex] = projectWithTimestamp
      } else {
        projects.push(projectWithTimestamp)
      }

      localStorage.setItem("devmirror-offline-projects", JSON.stringify(projects))
      setOfflineProjects(projects)
      calculateStorageUsage()

      if (!isOnline) {
        toast({
          title: "💾 Saved Offline",
          description: "Project saved to local storage while offline.",
        })
      }
    } catch (error) {
      toast({
        title: "⚠️ Storage Error",
        description: "Failed to save project offline. Storage might be full.",
        variant: "destructive",
      })
    }
  }

  const downloadProject = (project: Project) => {
    const projectData = {
      name: project.name,
      files: {
        "index.html": project.html,
        "styles.css": project.css,
        "script.js": project.js,
      },
      metadata: {
        created: project.lastModified,
        generator: "DevMirror",
        version: "1.0.0",
      },
    }

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "📥 Project Downloaded",
      description: `${project.name} has been downloaded as JSON.`,
    })
  }

  const deleteOfflineProject = (projectName: string) => {
    const updatedProjects = offlineProjects.filter((p) => p.name !== projectName)
    localStorage.setItem("devmirror-offline-projects", JSON.stringify(updatedProjects))
    setOfflineProjects(updatedProjects)
    calculateStorageUsage()

    toast({
      title: "🗑️ Project Deleted",
      description: `${projectName} has been removed from offline storage.`,
    })
  }

  const syncToCloud = async (project: Project) => {
    if (!isOnline) {
      toast({
        title: "❌ Sync Failed",
        description: "Cannot sync while offline.",
        variant: "destructive",
      })
      return
    }

    setSyncStatus("syncing")

    // Simulate cloud sync with progress
    toast({
      title: "☁️ Syncing...",
      description: "Uploading project to cloud storage.",
    })

    setTimeout(() => {
      setSyncStatus("success")
      toast({
        title: "✅ Sync Complete",
        description: `${project.name} has been synced to the cloud.`,
      })

      setTimeout(() => setSyncStatus("idle"), 3000)
    }, 2000)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
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

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const storagePercentage = (storageUsed / maxStorage) * 100

  if (isOnline && offlineProjects.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 z-50">
      <Card
        className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} shadow-2xl backdrop-blur-sm transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-32"} overflow-hidden`}
      >
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-opacity-80 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className={`${isDarkMode ? "text-white" : "text-slate-800"} text-sm flex items-center`}>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-blue-600" : "bg-blue-100"}`}
                >
                  <HardDrive className={`h-4 w-4 ${isDarkMode ? "text-white" : "text-blue-600"}`} />
                </div>
                <span>Offline Storage</span>
              </div>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {syncStatus === "syncing" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
              {syncStatus === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {syncStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
              <Badge variant={isOnline ? "default" : "destructive"} className="text-xs flex items-center space-x-1">
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                <span>{isOnline ? "Online" : "Offline"}</span>
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} flex items-center justify-between`}
            >
              <span>{offlineProjects.length} projects</span>
              <span>
                {storageUsed}KB / {maxStorage}KB
              </span>
            </div>
            <Progress value={storagePercentage} className={`h-2 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            {storagePercentage > 80 && (
              <div
                className={`text-xs ${storagePercentage > 95 ? "text-red-500" : "text-yellow-500"} flex items-center`}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {storagePercentage > 95 ? "Storage almost full" : "Storage getting full"}
              </div>
            )}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 max-h-64 overflow-y-auto space-y-3">
            {offlineProjects.map((project, index) => (
              <div
                key={index}
                className={`${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-50 hover:bg-gray-100"} rounded-lg p-3 space-y-2 transition-colors duration-200 group`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`${isDarkMode ? "text-white" : "text-slate-800"} text-sm font-medium truncate flex-1 mr-2`}
                  >
                    {project.name}
                  </h4>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadProject(project)}
                      className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-600" : "text-slate-500 hover:text-slate-700 hover:bg-gray-200"}`}
                      title="Download project"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    {isOnline && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => syncToCloud(project)}
                        disabled={syncStatus === "syncing"}
                        className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-600" : "text-slate-500 hover:text-slate-700 hover:bg-gray-200"} disabled:opacity-50`}
                        title="Sync to cloud"
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteOfflineProject(project.name)}
                      className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-600" : "text-slate-500 hover:text-red-500 hover:bg-gray-200"}`}
                      title="Delete project"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className={`flex items-center text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(project.lastModified)}
                </div>
              </div>
            ))}

            {offlineProjects.length === 0 && (
              <div className="text-center py-6">
                <HardDrive className={`h-8 w-8 ${isDarkMode ? "text-slate-600" : "text-gray-300"} mx-auto mb-2`} />
                <p className={`${isDarkMode ? "text-slate-500" : "text-gray-500"} text-sm`}>
                  No offline projects saved
                </p>
                <p className={`${isDarkMode ? "text-slate-600" : "text-gray-400"} text-xs mt-1`}>
                  Projects are auto-saved when offline
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
