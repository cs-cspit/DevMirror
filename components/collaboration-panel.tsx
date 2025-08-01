"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  UserPlus,
  Crown,
  Eye,
  Edit,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Clock,
  Wifi,
  WifiOff,
  Circle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
  status: "online" | "offline" | "away"
  cursor?: {
    line: number
    column: number
    file: string
  }
  lastSeen: string
}

interface Change {
  id: string
  userId: string
  userName: string
  type: "edit" | "add" | "delete"
  file: string
  line: number
  content: string
  timestamp: string
}

interface CollaborationPanelProps {
  projectId: string
  currentUser: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  isOnline: boolean
  isDarkMode?: boolean
}

export function CollaborationPanel({ projectId, currentUser, isOnline, isDarkMode = true }: CollaborationPanelProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "user1",
      name: "Alex Chen",
      email: "alex@devmirror.com",
      avatar: "/placeholder.svg?height=32&width=32&text=AC",
      role: "owner",
      status: "online",
      cursor: { line: 45, column: 12, file: "index.html" },
      lastSeen: new Date().toISOString(),
    },
    {
      id: "user2",
      name: "Sarah Kim",
      email: "sarah@devmirror.com",
      avatar: "/placeholder.svg?height=32&width=32&text=SK",
      role: "editor",
      status: "online",
      cursor: { line: 23, column: 8, file: "styles.css" },
      lastSeen: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: "user3",
      name: "Mike Johnson",
      email: "mike@devmirror.com",
      role: "viewer",
      status: "away",
      lastSeen: new Date(Date.now() - 900000).toISOString(),
    },
  ])

  const [recentChanges, setRecentChanges] = useState<Change[]>([
    {
      id: "change1",
      userId: "user2",
      userName: "Sarah Kim",
      type: "edit",
      file: "styles.css",
      line: 23,
      content: "Added responsive breakpoints",
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: "change2",
      userId: "user1",
      userName: "Alex Chen",
      type: "add",
      file: "script.js",
      line: 45,
      content: "Implemented dark mode toggle",
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: "change3",
      userId: "user2",
      userName: "Sarah Kim",
      type: "edit",
      file: "index.html",
      line: 12,
      content: "Updated navigation structure",
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
  ])

  const [inviteEmail, setInviteEmail] = useState("")
  const [showInvite, setShowInvite] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const { toast } = useToast()

  // Simulate real-time updates
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(() => {
      // Simulate cursor movements
      setCollaborators((prev) =>
        prev.map((collab) => {
          if (collab.status === "online" && Math.random() > 0.7) {
            return {
              ...collab,
              cursor: {
                line: Math.floor(Math.random() * 100) + 1,
                column: Math.floor(Math.random() * 50) + 1,
                file: ["index.html", "styles.css", "script.js"][Math.floor(Math.random() * 3)],
              },
            }
          }
          return collab
        }),
      )

      // Simulate new changes
      if (Math.random() > 0.8) {
        const activeUsers = collaborators.filter((c) => c.status === "online" && c.id !== currentUser.id)
        if (activeUsers.length > 0) {
          const user = activeUsers[Math.floor(Math.random() * activeUsers.length)]
          const newChange: Change = {
            id: `change-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            type: ["edit", "add", "delete"][Math.floor(Math.random() * 3)] as any,
            file: ["index.html", "styles.css", "script.js"][Math.floor(Math.random() * 3)],
            line: Math.floor(Math.random() * 100) + 1,
            content: [
              "Fixed responsive layout",
              "Added animation effects",
              "Updated color scheme",
              "Optimized performance",
              "Added new component",
            ][Math.floor(Math.random() * 5)],
            timestamp: new Date().toISOString(),
          }

          setRecentChanges((prev) => [newChange, ...prev.slice(0, 9)])
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isOnline, collaborators, currentUser.id])

  const handleInvite = () => {
    if (!inviteEmail.trim()) return

    // Simulate sending invite
    toast({
      title: "🚀 Invitation Sent",
      description: `Collaboration invite sent to ${inviteEmail}`,
    })

    setInviteEmail("")
    setShowInvite(false)
  }

  const copyShareLink = async () => {
    const shareLink = `${window.location.origin}/collaborate/${projectId}`
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
      toast({
        title: "🔗 Link Copied",
        description: "Collaboration link copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />
      case "editor":
        return <Edit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <Eye className="h-3 w-3" />
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <Edit className="h-3 w-3 text-blue-400" />
      case "add":
        return <Circle className="h-3 w-3 text-green-400" />
      case "delete":
        return <Circle className="h-3 w-3 text-red-400" />
      default:
        return <Edit className="h-3 w-3 text-blue-400" />
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return time.toLocaleDateString()
  }

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"} border-b`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-purple-600" : "bg-purple-100"}`}
            >
              <Users className={`h-4 w-4 ${isDarkMode ? "text-white" : "text-purple-600"}`} />
            </div>
            <div>
              <h3 className={`${isDarkMode ? "text-white" : "text-slate-800"} font-semibold`}>Collaboration</h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} flex items-center`}>
                {isOnline ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    Live sync enabled
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline mode
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowInvite(!showInvite)}
              className={`h-8 w-8 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"}`}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyShareLink}
              className={`h-8 w-8 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"}`}
            >
              {copiedLink ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Invite Section */}
        {showInvite && (
          <div className={`${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg p-3 space-y-3`}>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className={`flex-1 ${isDarkMode ? "bg-slate-600 border-slate-500 text-white placeholder-slate-400" : "bg-white border-gray-300 text-slate-800 placeholder-gray-500"} text-sm`}
                onKeyPress={(e) => e.key === "Enter" && handleInvite()}
              />
              <Button
                size="sm"
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Invite
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={copyShareLink}
              className={`w-full ${isDarkMode ? "border-slate-500 text-slate-300 hover:bg-slate-600" : "border-gray-300 text-slate-600 hover:bg-gray-50"} text-sm`}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy Share Link
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Collaborators */}
        <div>
          <h4
            className={`${isDarkMode ? "text-slate-300" : "text-slate-700"} text-sm font-medium mb-3 flex items-center`}
          >
            <Users className="h-4 w-4 mr-2" />
            Active Collaborators ({collaborators.filter((c) => c.status === "online").length})
          </h4>

          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className={`${isDarkMode ? "bg-slate-700/50 hover:bg-slate-700" : "bg-white hover:bg-gray-50"} rounded-lg p-3 transition-colors duration-200 border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${isDarkMode ? "border-slate-700" : "border-white"} ${getStatusColor(collaborator.status)}`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className={`${isDarkMode ? "text-white" : "text-slate-800"} text-sm font-medium truncate`}>
                          {collaborator.name}
                          {collaborator.id === currentUser.id && " (You)"}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(collaborator.role)}
                          <Badge
                            variant="secondary"
                            className={`text-xs ${isDarkMode ? "bg-slate-600 text-slate-300" : "bg-gray-100 text-gray-600"}`}
                          >
                            {collaborator.role}
                          </Badge>
                        </div>
                      </div>

                      {collaborator.status === "online" && collaborator.cursor && (
                        <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-xs`}>
                          Editing {collaborator.cursor.file} • Line {collaborator.cursor.line}
                        </p>
                      )}

                      {collaborator.status !== "online" && (
                        <p className={`${isDarkMode ? "text-slate-500" : "text-slate-400"} text-xs flex items-center`}>
                          <Clock className="h-3 w-3 mr-1" />
                          Last seen {formatTime(collaborator.lastSeen)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {collaborator.status === "online" && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Changes */}
        <div>
          <h4
            className={`${isDarkMode ? "text-slate-300" : "text-slate-700"} text-sm font-medium mb-3 flex items-center`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Recent Changes
          </h4>

          <div className="space-y-2">
            {recentChanges.map((change) => (
              <div
                key={change.id}
                className={`${isDarkMode ? "bg-slate-700/30 border-slate-600" : "bg-gray-50 border-gray-200"} rounded-lg p-3 border`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getChangeIcon(change.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`${isDarkMode ? "text-white" : "text-slate-800"} text-sm font-medium`}>
                        {change.userName}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${isDarkMode ? "border-slate-500 text-slate-400" : "border-gray-300 text-gray-500"}`}
                      >
                        {change.file}
                      </Badge>
                    </div>

                    <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-sm mb-2`}>
                      {change.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className={`${isDarkMode ? "text-slate-500" : "text-slate-400"} text-xs`}>
                        Line {change.line} • {formatTime(change.timestamp)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs capitalize ${
                          change.type === "edit"
                            ? "bg-blue-100 text-blue-700"
                            : change.type === "add"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {change.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Stats */}
        <div
          className={`${isDarkMode ? "bg-slate-700/30 border-slate-600" : "bg-gray-50 border-gray-200"} rounded-lg p-4 border`}
        >
          <h4 className={`${isDarkMode ? "text-slate-300" : "text-slate-700"} text-sm font-medium mb-3`}>
            Session Stats
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`${isDarkMode ? "text-cyan-400" : "text-cyan-600"} text-lg font-bold`}>
                {collaborators.length}
              </div>
              <div className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-xs`}>Total Members</div>
            </div>

            <div className="text-center">
              <div className={`${isDarkMode ? "text-green-400" : "text-green-600"} text-lg font-bold`}>
                {recentChanges.length}
              </div>
              <div className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-xs`}>Recent Changes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
