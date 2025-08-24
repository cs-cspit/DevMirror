"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  MoreVertical,
  Code2,
  Calendar,
  Share2,
  Trash2,
  Edit,
  Copy,
  Star,
  LogOut
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useSession, signOut } from "next-auth/react"

interface Project {
  id: string
  name: string
  description: string
  html: string
  css: string
  js: string
  lastModified: string
  isStarred: boolean
  tags: string[]
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTag, setFilterTag] = useState("")
  const { toast } = useToast()
  const { data: session } = useSession() // NextAuth session

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user) {
      loadProjects()
    }
  }, [session])

  const loadProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem("devmirror-projects") || "[]")
    const projectsWithIds = savedProjects.map((project: any, index: number) => ({
      id: project.id || `project-${index}`,
      name: project.name || "Untitled Project",
      description: project.description || "No description",
      html: project.html || "",
      css: project.css || "",
      js: project.js || "",
      lastModified: project.lastModified || new Date().toISOString(),
      isStarred: project.isStarred || false,
      tags: project.tags || ["html", "css", "js"],
    }))
    projectsWithIds.sort((a: Project, b: Project) => {
      if (a.isStarred && !b.isStarred) return -1
      if (!a.isStarred && b.isStarred) return 1
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    })
    setProjects(projectsWithIds)
  }

  const saveProjects = (updated: Project[]) => {
    setProjects(updated)
    localStorage.setItem("devmirror-projects", JSON.stringify(updated))
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !filterTag || project.tags.includes(filterTag)
    return matchesSearch && matchesFilter
  })

  const toggleStar = (projectId: string) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, isStarred: !p.isStarred } : p
    )
    saveProjects(updated)
  }

  const deleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId)
    saveProjects(updated)
    toast({
      title: "Project Deleted",
      description: "Project has been removed from your dashboard.",
    })
  }

  const duplicateProject = (project: Project) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      name: `${project.name} (Copy)`,
      lastModified: new Date().toISOString(),
    }
    const updated = [...projects, newProject]
    saveProjects(updated)
    toast({
      title: "Project Duplicated",
      description: `${newProject.name} has been created.`,
    })
  }

  const shareProject = async (projectId: string) => {
    const url = `${window.location.origin}/editor?project=${projectId}`
    await navigator.clipboard.writeText(url)
    toast({
      title: "Link Copied",
      description: "Project link copied to clipboard!",
    })
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)))

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/80 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="DevMirror" width={32} height={32} className="rounded-lg shadow-md" />
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  DevMirror
                </h1>
                <p className="text-xs text-cyan-300/70">Dashboard</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {session?.user ? (
                <Button
                  className="bg-red-600 hover:bg-red-500 text-white"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link href="/auth">
                  <Button className="bg-green-600 hover:bg-green-500 text-white">Sign In</Button>
                </Link>
              )}

              {session?.user && (
                <Link href="/editor">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none shadow-md transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container mx-auto px-4 py-8 flex-1">
        {!session?.user ? (
          <div className="text-center py-16">
            <Code2 className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">
              Please sign in to access your dashboard
            </h3>
            <p className="text-cyan-400 mb-6">
              Sign in to view your projects, edit, share, or create new ones.
            </p>
            <Link href="/auth">
              <Button className="bg-green-600 hover:bg-green-500 text-white">
                Go to Sign In
              </Button>
            </Link>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Code2 className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">
              {projects.length === 0 ? "No projects yet" : "No projects found"}
            </h3>
            <p className="text-cyan-400 mb-6">
              {projects.length === 0
                ? "Create your first project to get started with DevMirror"
                : "Try adjusting your search or filter criteria"}
            </p>
            {projects.length === 0 && (
              <Link href="/editor">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-2xl transition-shadow group bg-[#23272f] border border-gray-800 rounded-xl shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate text-silver-100">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 text-gray-400">
                        {project.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStar(project.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                      >
                        <Star
                          className={`h-4 w-4 ${project.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                      <div className="relative group/menu">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        <div className="absolute right-0 top-8 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                          <div className="py-1">
                            <button
                              onClick={() => duplicateProject(project)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-800 text-gray-300 border-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(project.lastModified)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/editor?project=${project.id}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-silver-100 border border-gray-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareProject(project.id)}
                      className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300 bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
