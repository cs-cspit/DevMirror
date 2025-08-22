"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Save,
  Download,
  Share2,
  Sparkles,
  FolderOpen,
  Play,
  Pause,
  Users,
  Cloud,
  Settings,
  Wifi,
  WifiOff,
  Menu,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { LivePreview } from "@/components/live-preview"
import FolderManager from "@/components/folder-manager"
import { CollaborationSystem } from "@/components/collaboration-system"
import { CloudStorage } from "@/components/cloud-storage"
import { AIAssistant } from "@/components/ai-assistant"
import { LanguageSelector } from "@/components/language-selector"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
const CodeEditor = dynamic(() => import("@/components/code-editor"), { ssr: false })

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  parentId: string | null
  content?: string
  language?: string
  children?: FileItem[]
  isOpen?: boolean
  lastModified: string
  isModified?: boolean
}

export default function EditorPage() {
  // Initialize with default project structure
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "root",
      name: "My Project",
      type: "folder",
      parentId: null,
      isOpen: true,
      lastModified: new Date().toISOString(),
      children: [
        {
          id: "html-1",
          name: "index.html",
          type: "file",
          parentId: "root",
          language: "html",
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to DevMirror</h1>
        <p>Start building amazing websites with our professional editor.</p>
        <button onclick="showMessage()" class="btn">Get Started</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          lastModified: new Date().toISOString(),
          isModified: false,
        },
        {
          id: "css-1",
          name: "styles.css",
          type: "file",
          parentId: "root",
          language: "css",
          content: `/* Professional CSS Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f5f5f5;
}

.container {
    background: #2a2a2a;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    text-align: center;
    max-width: 500px;
    width: 90%;
    border: 1px solid #404040;
}

h1 {
    color: #f5f5f5;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    font-weight: 700;
}

p {
    color: #b0b0b0;
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
}

.btn {
    background: #404040;
    color: #f5f5f5;
    border: 1px solid #606060;
    padding: 12px 32px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn:hover {
    background: #505050;
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .container {
        margin: 1rem;
        padding: 2rem;
    }
    
    h1 {
        font-size: 2rem;
    }
}`,
          lastModified: new Date().toISOString(),
          isModified: false,
        },
        {
          id: "js-1",
          name: "script.js",
          type: "file",
          parentId: "root",
          language: "javascript",
          content: `// Professional JavaScript
console.log('DevMirror loaded successfully!');

function showMessage() {
    alert('Welcome to DevMirror! Start building amazing projects.');
    
    // Add some interactive effects
    const button = document.querySelector('.btn');
    if (button) {
        button.style.background = '#606060';
        button.textContent = 'Amazing!';
        
        setTimeout(() => {
            button.style.background = '#404040';
            button.textContent = 'Get Started';
        }, 2000);
    }
}

// Add interactive features when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
    
    // Add hover effects to container
    const container = document.querySelector('.container');
    if (container) {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});`,
          lastModified: new Date().toISOString(),
          isModified: false,
        },
      ],
    },
  ])

  const [activeFile, setActiveFile] = useState<FileItem | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [showCloudStorage, setShowCloudStorage] = useState(false)
  const [showFolders, setShowFolders] = useState(true)
  const [projectName, setProjectName] = useState("My DevMirror Project")
  const [isRunning, setIsRunning] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["html", "css", "javascript"])
  const { toast } = useToast()

  const [currentUser] = useState({
    id: "current-user",
    name: "Developer",
    email: "dev@devmirror.com",
    avatar: "/placeholder.svg?height=32&width=32&text=DV",
  })

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load saved files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem("devmirror-project-files")
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        setFiles(parsedFiles)
      } catch (error) {
        console.error("Error loading saved files:", error)
      }
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const project = {
        name: projectName,
        files: files,
        lastModified: new Date().toISOString(),
      }
      localStorage.setItem("devmirror-current-project", JSON.stringify(project))
      setLastSaved(new Date())
    }

    const timer = setTimeout(autoSave, 3000)
    return () => clearTimeout(timer)
  }, [files, projectName])

  // Set default active file
  useEffect(() => {
    if (!activeFile && files.length > 0) {
      const findFirstFile = (items: FileItem[]): FileItem | null => {
        for (const item of items) {
          if (item.type === "file") return item
          if (item.children) {
            const found = findFirstFile(item.children)
            if (found) return found
          }
        }
        return null
      }

      const firstFile = findFirstFile(files)
      if (firstFile) {
        setActiveFile(firstFile)
      }
    }
  }, [files, activeFile])

  const handleSave = () => {
    const project = {
      name: projectName,
      files: files,
      lastModified: new Date().toISOString(),
    }

    const savedProjects = JSON.parse(localStorage.getItem("devmirror-projects") || "[]")
    const existingIndex = savedProjects.findIndex((p: any) => p.name === projectName)

    if (existingIndex >= 0) {
      savedProjects[existingIndex] = project
    } else {
      savedProjects.push(project)
    }

    localStorage.setItem("devmirror-projects", JSON.stringify(savedProjects))
    setLastSaved(new Date())

    toast({
      title: "Project Saved",
      description: `${projectName} saved successfully.`,
    })
  }

  const handleDownload = () => {
    const findFilesByLanguage = (items: FileItem[], language: string): FileItem[] => {
      let result: FileItem[] = []
      for (const item of items) {
        if (item.type === "file" && item.language === language) {
          result.push(item)
        }
        if (item.children) {
          result = result.concat(findFilesByLanguage(item.children, language))
        }
      }
      return result
    }

    const htmlFiles = findFilesByLanguage(files, "html")
    const cssFiles = findFilesByLanguage(files, "css")
    const jsFiles = findFilesByLanguage(files, "javascript")

    const filesToDownload = [
      ...htmlFiles.map((f) => ({ name: f.name, content: f.content || "" })),
      ...cssFiles.map((f) => ({ name: f.name, content: f.content || "" })),
      ...jsFiles.map((f) => ({ name: f.name, content: f.content || "" })),
    ]

    if (filesToDownload.length === 0) {
      toast({
        title: "No Files to Download",
        description: "Create some files first before downloading.",
        variant: "destructive",
      })
      return
    }

    filesToDownload.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })

    toast({
      title: "Files Downloaded",
      description: `${filesToDownload.length} files have been downloaded.`,
    })
  }

  const handleShare = () => {
    const shareData = {
      name: projectName,
      files: files,
    }

    const encoded = btoa(JSON.stringify(shareData))
    const shareUrl = `${window.location.origin}/shared/${encoded}`

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Share Link Created",
          description: "Project link copied to clipboard.",
        })
      })
      .catch(() => {
        toast({
          title: "Share Failed",
          description: "Unable to create share link.",
          variant: "destructive",
        })
      })
  }

  const handleFileSelect = (file: FileItem) => {
    setActiveFile(file)
  }

  const handleFileUpdate = (fileId: string, content: string) => {
    const updateFileContent = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === fileId) {
          return {
            ...item,
            content,
            isModified: true,
            lastModified: new Date().toISOString(),
          }
        }
        if (item.children) {
          return {
            ...item,
            children: updateFileContent(item.children),
          }
        }
        return item
      })
    }

    const updatedFiles = updateFileContent(files)
    setFiles(updatedFiles)

    if (activeFile && activeFile.id === fileId) {
      setActiveFile({ ...activeFile, content, isModified: true })
    }
  }

  const handleCodeChange = (newCode: string) => {
    if (activeFile) {
      handleFileUpdate(activeFile.id, newCode)
    }
  }

  const getCurrentCode = () => {
    return activeFile?.content || ""
  }

  const getCurrentLanguage = () => {
    return activeFile?.language || "text"
  }

  const togglePreview = () => {
    setIsRunning(!isRunning)
  }

  const resetPreview = () => {
    setIsRunning(false)
    setTimeout(() => setIsRunning(true), 100)
  }

  const getActivePanelCount = () => {
    let count = 1
    if (showFolders) count++
    if (showAI) count++
    if (showCollaboration) count++
    if (showCloudStorage) count++
    return count
  }

  const getPanelWidth = () => {
    const panelCount = getActivePanelCount()
    if (panelCount <= 2) return "w-1/2"
    if (panelCount === 3) return "w-1/3"
    return "w-1/4"
  }

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages((prev) => prev.filter((id) => id !== languageId))
  }

  const handleLanguageAdd = (language: any) => {
    if (!selectedLanguages.includes(language.id)) {
      setSelectedLanguages((prev) => [...prev, language.id])
      toast({
        title: `${language.name} Added`,
        description: `${language.name} support enabled for this project`,
      })
    }
  }

  const getPreviewCode = () => {
    const findFilesByLanguage = (items: FileItem[], language: string): string => {
      let result = ""
      for (const item of items) {
        if (item.type === "file" && item.language === language && item.content) {
          result += item.content + "\n"
        }
        if (item.children) {
          result += findFilesByLanguage(item.children, language)
        }
      }
      return result
    }

    return {
      html: findFilesByLanguage(files, "html"),
      css: findFilesByLanguage(files, "css"),
      js: findFilesByLanguage(files, "javascript"),
    }
  }

  const previewCode = getPreviewCode()

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col text-white">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="DevMirror" width={28} height={28} className="rounded-lg" />
              <span className="text-silver-100 font-semibold hidden sm:block">DevMirror</span>
            </Link>

            <div className="hidden sm:block">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-gray-800 text-silver-100 border border-gray-700 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 min-w-[200px] placeholder-gray-500"
                placeholder="Project name..."
              />
            </div>

            {lastSaved && (
              <div className="hidden md:flex items-center text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Auto-saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Status indicators */}
            <div className="hidden sm:flex items-center space-x-3 text-xs">
              {isOnline ? (
                <div className="flex items-center text-green-400">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span className="font-medium">ONLINE</span>
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="font-medium">OFFLINE</span>
                </div>
              )}

              <div className="flex items-center text-gray-400">
                <Settings className="h-4 w-4 mr-1" />
                <span className="font-medium">READY</span>
              </div>
            </div>

            {/* Action buttons restored */}
            <div className="hidden md:flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowFolders(!showFolders)}
                    className={`text-gray-400 hover:bg-gray-800 hover:text-gray-300 ${showFolders ? "bg-gray-800 text-gray-300" : ""}`}
                  >
                    <FolderOpen className="h-4 w-4 mr-1" />
                    Files
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle File Explorer</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAI(!showAI)}
                    className={`text-gray-400 hover:bg-gray-800 hover:text-gray-300 ${showAI ? "bg-gray-800 text-gray-300" : ""}`}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle AI Assistant</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowCollaboration(!showCollaboration)}
                    className={`text-gray-400 hover:bg-gray-800 hover:text-gray-300 ${showCollaboration ? "bg-gray-800 text-gray-300" : ""}`}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Team
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Team Collaboration</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowCloudStorage(!showCloudStorage)}
                    className={`text-gray-400 hover:bg-gray-800 hover:text-gray-300 ${showCloudStorage ? "bg-gray-800 text-gray-300" : ""}`}
                  >
                    <Cloud className="h-4 w-4 mr-1" />
                    Cloud
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cloud Storage</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-6 bg-gray-700 mx-2"></div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSave}
                    className="text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Project</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDownload}
                    className="text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Files</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShare}
                    className="text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Project</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/templates">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:bg-gray-800 hover:text-gray-300">
                      <FolderOpen className="h-4 w-4 mr-1" />
                      Templates
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browse Templates</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Mobile menu */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-400 hover:bg-gray-800 hover:text-gray-300"
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 space-y-3 relative z-10">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-gray-800 text-silver-100 border border-gray-700 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
              placeholder="Project name..."
            />
            {/* ...existing code... */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:bg-gray-800 bg-transparent"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:bg-gray-800 bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={handleShare}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:bg-gray-800 bg-transparent"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        )}


        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer */}
          {showFolders && (
            <div className="w-64 border-r bg-gray-900 border-gray-800">
              <FolderManager
                files={files}
                setFiles={setFiles}
                activeFileId={activeFile?.id || null}
                setActiveFileId={id => {
                  const findFile = (items: FileItem[]): FileItem | null => {
                    for (const item of items) {
                      if (item.id === id) return item;
                      if (item.children) {
                        const found = findFile(item.children);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  setActiveFile(findFile(files));
                }}
              />
            </div>
          )}

          {/* Code Editor */}
          <div className={`${getPanelWidth()} flex flex-col border-r border-gray-800 overflow-auto`}>
            <div className="bg-gray-900 border-b border-gray-800 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400 text-sm font-medium">
                    {activeFile ? activeFile.name : "Select a file"}
                  </span>
                  {activeFile && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {getCurrentLanguage().toUpperCase()}
                    </span>
                  )}
                  {activeFile?.isModified && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Modified</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePreview}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                  >
                    {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              {activeFile ? (
                <CodeEditor
                  files={files.flatMap(f =>
                    f.type === 'folder' && f.children
                      ? f.children.map(child => ({ id: child.id, name: child.name, content: child.content || '' }))
                      : f.type === 'file'
                        ? [{ id: f.id, name: f.name, content: f.content || '' }]
                        : []
                  )}
                  setFiles={(updatedFiles: { id: any; name: string; content: string }[]) => {
                    setFiles(prevFiles => {
                      // Replace the children of the root folder with updatedFiles, preserving FileItem structure
                      return prevFiles.map(f =>
                        f.type === 'folder' && f.children
                          ? {
                              ...f,
                              children: f.children.map(child => {
                                const updated = updatedFiles.find(u => u.id === child.id);
                                return updated
                                  ? { ...child, content: updated.content, name: updated.name, isModified: true, lastModified: new Date().toISOString() }
                                  : child;
                              }),
                            }
                          : f
                      );
                    });
                  }}
                  activeFileId={activeFile?.id}
                  setActiveFileId={(id: string) => {
                    const file = files.flatMap(f =>
                      f.type === 'folder' && f.children
                        ? f.children
                        : f.type === 'file'
                          ? [f]
                          : []
                    ).find(f => f.id === id);
                    setActiveFile(file || null);
                  }}
                  onChange={handleCodeChange}
                  className="h-full"
                  isDarkMode={true}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <FolderOpen className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No File Selected</h3>
                    <p className="text-gray-600 mb-4">Select a file from the explorer to start coding</p>
                    <Button onClick={() => setShowFolders(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Open File Explorer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div
            className={`${getPanelWidth()} ${showAI || showCollaboration || showCloudStorage ? "border-r border-gray-800" : ""}`}
          >
            <LivePreview
              html={previewCode.html}
              css={previewCode.css}
              js={previewCode.js}
              isRunning={isRunning}
              onToggleRun={togglePreview}
              onReset={resetPreview}
              isDarkMode={true}
            />
          </div>

          {/* AI Assistant as Modal */}
          <Dialog open={showAI} onOpenChange={setShowAI}>
            <DialogContent className="max-w-2xl w-full rounded-2xl p-0 overflow-hidden shadow-2xl border-0">
              <DialogTitle className="text-lg font-bold px-6 pt-6 pb-2">AI Assistant</DialogTitle>
              <div className="px-6 pb-6 pt-2">
                <AIAssistant
                  currentCode={previewCode}
                  onCodeSuggestion={(code, language) => {
                    if (activeFile && activeFile.language === language) {
                      handleCodeChange(code)
                    } else {
                      toast({
                        title: "AI Suggestion",
                        description: `Switch to a ${language.toUpperCase()} file to apply this suggestion.`,
                      })
                    }
                  }}
                  isDarkMode={true}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Collaboration Panel as Modal */}
          <Dialog open={showCollaboration} onOpenChange={setShowCollaboration}>
            <DialogContent className="max-w-2xl w-full rounded-2xl p-0 overflow-hidden shadow-2xl border-0">
              <DialogTitle className="text-lg font-bold px-6 pt-6 pb-2">Team Collaboration</DialogTitle>
              <div className="px-6 pb-6 pt-2">
                <CollaborationSystem
                  projectId="demo-project"
                  currentUser={currentUser}
                  isOnline={isOnline}
                  isDarkMode={true}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Cloud Storage as Modal */}
          <Dialog open={showCloudStorage} onOpenChange={setShowCloudStorage}>
            <DialogContent className="max-w-2xl w-full rounded-2xl p-0 overflow-hidden shadow-2xl border-0">
              <DialogTitle className="text-lg font-bold px-6 pt-6 pb-2">Cloud Storage</DialogTitle>
              <div className="px-6 pb-6 pt-2">
                <CloudStorage
                  isOnline={isOnline}
                  currentProject={{
                    name: projectName,
                    html: previewCode.html,
                    css: previewCode.css,
                    js: previewCode.js,
                  }}
                  isDarkMode={true}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  )
}