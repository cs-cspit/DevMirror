"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  UserPlus,
  Crown,
  Eye,
  Edit,
  MessageSquare,
  Copy,
  Check,
  Clock,
  Wifi,
  WifiOff,
  Circle,
  Key,
  Link,
  Shield,
  X,
  Send,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
  status: "online" | "offline" | "away"
  joinedAt: string
  lastSeen: string
  accessCode?: string
}

interface CollaborationInvite {
  id: string
  email: string
  role: "editor" | "viewer"
  accessCode: string
  expiresAt: string
  status: "pending" | "accepted" | "expired"
}

interface CollaborationSystemProps {
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

export function CollaborationSystem({ projectId, currentUser, isOnline, isDarkMode = true }: CollaborationSystemProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
      role: "owner",
      status: "online",
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    },
  ])

  const [invites, setInvites] = useState<CollaborationInvite[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor")
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [projectAccessCode, setProjectAccessCode] = useState("")
  const [copiedCode, setCopiedCode] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const { toast } = useToast()

  // Generate project access code
  useEffect(() => {
    const generateAccessCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let result = ""
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    if (!projectAccessCode) {
      setProjectAccessCode(generateAccessCode())
    }
  }, [projectAccessCode])

  const generateInviteCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const sendEmailInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "❌ Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "❌ Invalid Email Format",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Check if user is already invited or collaborating
    const existingCollaborator = collaborators.find((c) => c.email === inviteEmail)
    const existingInvite = invites.find((i) => i.email === inviteEmail && i.status === "pending")

    if (existingCollaborator) {
      toast({
        title: "⚠️ Already Collaborating",
        description: "This user is already part of the project",
        variant: "destructive",
      })
      return
    }

    if (existingInvite) {
      toast({
        title: "⚠️ Invite Pending",
        description: "An invitation has already been sent to this email",
        variant: "destructive",
      })
      return
    }

    setIsInviting(true)

    // Simulate sending email
    setTimeout(() => {
      const newInvite: CollaborationInvite = {
        id: `invite-${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        accessCode: generateInviteCode(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: "pending",
      }

      setInvites([...invites, newInvite])
      setInviteEmail("")
      setShowInviteForm(false)
      setIsInviting(false)

      toast({
        title: "📧 Invitation Sent Successfully",
        description: `Collaboration invite sent to ${inviteEmail} with access code: ${newInvite.accessCode}`,
      })
    }, 1500)
  }

  const copyProjectCode = async () => {
    try {
      await navigator.clipboard.writeText(projectAccessCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
      toast({
        title: "📋 Code Copied",
        description: "Project access code copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyInviteLink = async (invite: CollaborationInvite) => {
    const inviteLink = `${window.location.origin}/join/${projectId}?code=${invite.accessCode}`
    try {
      await navigator.clipboard.writeText(inviteLink)
      toast({
        title: "🔗 Invite Link Copied",
        description: "Invitation link copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const revokeInvite = (inviteId: string) => {
    setInvites(invites.filter((invite) => invite.id !== inviteId))
    toast({
      title: "🚫 Invite Revoked",
      description: "Invitation has been cancelled",
    })
  }

  const removeCollaborator = (collaboratorId: string) => {
    if (collaboratorId === currentUser.id) {
      toast({
        title: "❌ Cannot Remove Owner",
        description: "You cannot remove yourself as the project owner",
        variant: "destructive",
      })
      return
    }

    setCollaborators(collaborators.filter((c) => c.id !== collaboratorId))
    toast({
      title: "👋 Collaborator Removed",
      description: "User has been removed from the project",
    })
  }

  const changeRole = (collaboratorId: string, newRole: "editor" | "viewer") => {
    if (collaboratorId === currentUser.id) {
      toast({
        title: "❌ Cannot Change Owner Role",
        description: "You cannot change your own role as the project owner",
        variant: "destructive",
      })
      return
    }

    setCollaborators(collaborators.map((c) => (c.id === collaboratorId ? { ...c, role: newRole } : c)))

    toast({
      title: "🔄 Role Updated",
      description: `User role changed to ${newRole}`,
    })
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
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "editor":
        return <Edit className="h-3 w-3 text-blue-500" />
      case "viewer":
        return <Eye className="h-3 w-3 text-gray-500" />
      default:
        return <Eye className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
              <h3 className={`${isDarkMode ? "text-white" : "text-slate-800"} font-semibold`}>Team Collaboration</h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} flex items-center`}>
                {isOnline ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    Secure connection
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

          <Button
            size="sm"
            onClick={() => setShowInviteForm(!showInviteForm)}
            disabled={!isOnline}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team
          </Button>
        </div>

        {/* Project Access Code */}
        <Card className={`${isDarkMode ? "bg-slate-700/50 border-slate-600" : "bg-blue-50 border-blue-200"} mb-4`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center`}>
              <Key className="h-4 w-4 mr-2" />
              Project Access Code
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <code
                className={`flex-1 px-3 py-2 rounded font-mono text-lg font-bold tracking-wider ${isDarkMode ? "bg-slate-800 text-cyan-400 border border-slate-600" : "bg-white text-blue-600 border border-blue-300"}`}
              >
                {projectAccessCode}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={copyProjectCode}
                className={`${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-600" : "border-gray-300 text-slate-600 hover:bg-gray-50"}`}
              >
                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} mt-2`}>
              Share this code with team members to join the project instantly
            </p>
          </CardContent>
        </Card>

        {/* Invite Form */}
        {showInviteForm && (
          <Card className={`${isDarkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200"} mb-4`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  Invite Team Member
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInviteForm(false)}
                  className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="space-y-2">
                <label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={`${isDarkMode ? "bg-slate-600 border-slate-500 text-white placeholder-slate-400" : "bg-white border-gray-300 text-slate-800 placeholder-gray-500"}`}
                  onKeyPress={(e) => e.key === "Enter" && !isInviting && sendEmailInvite()}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Permission Level
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "editor" | "viewer")}
                  className={`w-full px-3 py-2 rounded border text-sm ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300 text-slate-800"}`}
                >
                  <option value="editor">Editor - Can edit and modify files</option>
                  <option value="viewer">Viewer - Can only view files</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  onClick={sendEmailInvite}
                  disabled={isInviting || !inviteEmail.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowInviteForm(false)
                    setInviteEmail("")
                  }}
                  className={`${isDarkMode ? "border-slate-500 text-slate-300 hover:bg-slate-600" : "border-gray-300 text-slate-600 hover:bg-gray-50"}`}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Collaborators */}
        <div>
          <h4
            className={`${isDarkMode ? "text-slate-300" : "text-slate-700"} text-sm font-medium mb-3 flex items-center`}
          >
            <Users className="h-4 w-4 mr-2" />
            Team Members ({collaborators.length})
          </h4>

          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <Card
                key={collaborator.id}
                className={`${isDarkMode ? "bg-slate-700/50 border-slate-600" : "bg-white border-gray-200"} transition-colors duration-200`}
              >
                <CardContent className="p-3">
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

                        <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-xs`}>
                          {collaborator.email}
                        </p>

                        <p
                          className={`${isDarkMode ? "text-slate-500" : "text-slate-400"} text-xs flex items-center mt-1`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Joined {formatDate(collaborator.joinedAt)}
                        </p>
                      </div>
                    </div>

                    {collaborator.id !== currentUser.id && (
                      <div className="flex items-center space-x-1">
                        <select
                          value={collaborator.role}
                          onChange={(e) => changeRole(collaborator.id, e.target.value as "editor" | "viewer")}
                          className={`text-xs px-2 py-1 rounded border ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300 text-slate-800"}`}
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCollaborator(collaborator.id)}
                          className={`h-6 w-6 p-0 text-red-500 hover:bg-red-50`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div>
            <h4
              className={`${isDarkMode ? "text-slate-300" : "text-slate-700"} text-sm font-medium mb-3 flex items-center`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Pending Invitations ({invites.length})
            </h4>

            <div className="space-y-2">
              {invites.map((invite) => (
                <Card
                  key={invite.id}
                  className={`${isDarkMode ? "bg-slate-700/30 border-slate-600" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className={`${isDarkMode ? "text-white" : "text-slate-800"} text-sm font-medium`}>
                            {invite.email}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${isDarkMode ? "border-slate-500 text-slate-400" : "border-yellow-300 text-yellow-700"}`}
                          >
                            {invite.role}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            Pending
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          <code
                            className={`px-2 py-1 rounded font-mono ${isDarkMode ? "bg-slate-800 text-cyan-400" : "bg-white text-blue-600"}`}
                          >
                            {invite.accessCode}
                          </code>
                          <span className={`${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Expires {formatDate(invite.expiresAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyInviteLink(invite)}
                          className={`h-6 w-6 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-600" : "text-slate-500 hover:text-slate-700 hover:bg-gray-200"}`}
                          title="Copy invite link"
                        >
                          <Link className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => revokeInvite(invite.id)}
                          className={`h-6 w-6 p-0 text-red-500 hover:bg-red-50`}
                          title="Revoke invitation"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Security Info */}
        <Card className={`${isDarkMode ? "bg-slate-700/30 border-slate-600" : "bg-blue-50 border-blue-200"}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center`}>
              <Shield className="h-4 w-4 mr-2" />
              Security & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs">
              <div className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} flex items-center`}>
                <Circle className="h-2 w-2 mr-2 text-green-500" />
                All connections are encrypted end-to-end
              </div>
              <div className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} flex items-center`}>
                <Circle className="h-2 w-2 mr-2 text-green-500" />
                Access codes expire automatically after 7 days
              </div>
              <div className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} flex items-center`}>
                <Circle className="h-2 w-2 mr-2 text-green-500" />
                Only project owners can manage team members
              </div>
              <div className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} flex items-center`}>
                <Circle className="h-2 w-2 mr-2 text-green-500" />
                Real-time collaboration with conflict resolution
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
