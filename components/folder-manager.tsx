"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Folder,
  FolderPlus,
  FileText,
  Trash2,
  Edit3,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Copy,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface FolderManagerProps {
  onFileSelect: (file: FileItem) => void
  selectedFileId: string | null
  isDarkMode?: boolean
  onFileUpdate: (fileId: string, content: string) => void
  files: FileItem[]
  onFilesChange: (files: FileItem[]) => void
}

export function FolderManager({
  onFileSelect,
  selectedFileId,
  isDarkMode = true,
  onFileUpdate,
  files,
  onFilesChange,
}: FolderManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [showNewItemInput, setShowNewItemInput] = useState<{ type: "file" | "folder"; parentId: string } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const { toast } = useToast()

  // Auto-save files to localStorage
  useEffect(() => {
    localStorage.setItem("devmirror-project-files", JSON.stringify(files))
  }, [files])

  const findFileById = (files: FileItem[], id: string): FileItem | null => {
    for (const file of files) {
      if (file.id === id) return file
      if (file.children) {
        const found = findFileById(file.children, id)
        if (found) return found
      }
    }
    return null
  }

  const updateFileInTree = (files: FileItem[], updatedFile: FileItem): FileItem[] => {
    return files.map((file) => {
      if (file.id === updatedFile.id) {
        return { ...updatedFile, lastModified: new Date().toISOString() }
      }
      if (file.children) {
        return {
          ...file,
          children: updateFileInTree(file.children, updatedFile),
        }
      }
      return file
    })
  }

  const addNewItem = (parentId: string, type: "file" | "folder") => {
    if (!newItemName.trim()) return

    const newItem: FileItem = {
      id: `${type}-${Date.now()}`,
      name: newItemName,
      type,
      parentId,
      content: type === "file" ? getDefaultContent(newItemName) : undefined,
      language: type === "file" ? getLanguageFromExtension(newItemName) : undefined,
      children: type === "folder" ? [] : undefined,
      isOpen: type === "folder" ? false : undefined,
      lastModified: new Date().toISOString(),
      isModified: false,
    }

    const addToParent = (files: FileItem[]): FileItem[] => {
      return files.map((file) => {
        if (file.id === parentId && file.children) {
          return {
            ...file,
            children: [...file.children, newItem],
          }
        }
        if (file.children) {
          return {
            ...file,
            children: addToParent(file.children),
          }
        }
        return file
      })
    }

    const updatedFiles = addToParent(files)
    onFilesChange(updatedFiles)
    setNewItemName("")
    setShowNewItemInput(null)

    toast({
      title: `✨ ${type === "file" ? "File" : "Folder"} Created`,
      description: `${newItemName} has been added to your project`,
    })

    // Auto-select new file
    if (type === "file") {
      setTimeout(() => onFileSelect(newItem), 100)
    }
  }

  const deleteItem = (fileId: string) => {
    const deleteFromTree = (files: FileItem[]): FileItem[] => {
      return files
        .filter((file) => file.id !== fileId)
        .map((file) => ({
          ...file,
          children: file.children ? deleteFromTree(file.children) : undefined,
        }))
    }

    const updatedFiles = deleteFromTree(files)
    onFilesChange(updatedFiles)
    setContextMenu(null)

    toast({
      title: "🗑️ Item Deleted",
      description: "Item has been removed from your project",
    })
  }

  const renameItem = (fileId: string, newName: string) => {
    if (!newName.trim()) return

    const renameInTree = (files: FileItem[]): FileItem[] => {
      return files.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            name: newName,
            language: file.type === "file" ? getLanguageFromExtension(newName) : file.language,
            lastModified: new Date().toISOString(),
          }
        }
        if (file.children) {
          return { ...file, children: renameInTree(file.children) }
        }
        return file
      })
    }

    const updatedFiles = renameInTree(files)
    onFilesChange(updatedFiles)
    setEditingFile(null)
    setEditingName("")

    toast({
      title: "✏️ Item Renamed",
      description: `Renamed to ${newName}`,
    })
  }

  const toggleFolder = (folderId: string) => {
    const toggleInTree = (files: FileItem[]): FileItem[] => {
      return files.map((file) => {
        if (file.id === folderId && file.type === "folder") {
          return { ...file, isOpen: !file.isOpen }
        }
        if (file.children) {
          return { ...file, children: toggleInTree(file.children) }
        }
        return file
      })
    }

    const updatedFiles = toggleInTree(files)
    onFilesChange(updatedFiles)
  }

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      html: "html",
      htm: "html",
      css: "css",
      js: "javascript",
      jsx: "react",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
      kt: "kotlin",
      dart: "dart",
      sql: "sql",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      md: "markdown",
    }
    return langMap[ext || ""] || "text"
  }

  const getDefaultContent = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()

    switch (ext) {
      case "html":
      case "htm":
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename.replace(/\.[^/.]+$/, "")}</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to your new HTML file.</p>
</body>
</html>`

      case "css":
        return `/* ${filename} */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}`

      case "js":
        return `// ${filename}
console.log('Hello from ${filename}!');

// Your JavaScript code here
function greet(name) {
    return \`Hello, \${name}!\`;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
});`

      case "py":
        return `# ${filename}
print("Hello from Python!")

def main():
    """Main function"""
    print("Welcome to your new Python file!")

if __name__ == "__main__":
    main()`

      case "java":
        return `// ${filename}
public class ${filename.replace(/\.[^/.]+$/, "")} {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`

      case "json":
        return `{
  "name": "${filename.replace(/\.[^/.]+$/, "")}",
  "version": "1.0.0",
  "description": "A new JSON file"
}`

      case "md":
        return `# ${filename.replace(/\.[^/.]+$/, "")}

Welcome to your new Markdown file!

## Getting Started

- Edit this file to add your content
- Use Markdown syntax for formatting
- Preview your changes in real-time`

      default:
        return `// ${filename}
// Welcome to your new file!
// Start coding here...`
    }
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      return <Folder className={`h-4 w-4 ${file.isOpen ? "text-blue-400" : "text-slate-400"}`} />
    }

    const ext = file.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "html":
      case "htm":
        return <span className="text-orange-500 text-sm">🌐</span>
      case "css":
        return <span className="text-blue-500 text-sm">🎨</span>
      case "js":
      case "jsx":
        return <span className="text-yellow-500 text-sm">⚡</span>
      case "ts":
      case "tsx":
        return <span className="text-blue-600 text-sm">📘</span>
      case "py":
        return <span className="text-green-500 text-sm">🐍</span>
      case "java":
        return <span className="text-red-500 text-sm">☕</span>
      case "json":
        return <span className="text-yellow-600 text-sm">📋</span>
      case "md":
        return <span className="text-gray-600 text-sm">📝</span>
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  const saveFile = (fileId: string) => {
    const file = findFileById(files, fileId)
    if (file) {
      const updatedFile = { ...file, isModified: false, lastModified: new Date().toISOString() }
      const updatedFiles = updateFileInTree(files, updatedFile)
      onFilesChange(updatedFiles)

      toast({
        title: "💾 File Saved",
        description: `${file.name} has been saved`,
      })
    }
  }

  const renderFileTree = (items: FileItem[], level = 0) => {
    const filteredItems = searchQuery
      ? items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : items

    return filteredItems.map((item) => (
      <div key={item.id}>
        <div
          className={`flex items-center space-x-2 py-1.5 px-2 rounded cursor-pointer group transition-all duration-150 ${
            selectedFileId === item.id
              ? isDarkMode
                ? "bg-cyan-500/20 border-l-2 border-cyan-400 shadow-sm"
                : "bg-blue-100 border-l-2 border-blue-500 shadow-sm"
              : isDarkMode
                ? "hover:bg-slate-700/50"
                : "hover:bg-gray-100"
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.id)
            } else {
              onFileSelect(item)
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({ x: e.clientX, y: e.clientY, fileId: item.id })
          }}
        >
          {item.type === "folder" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(item.id)
              }}
            >
              {item.isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          {getFileIcon(item)}

          {editingFile === item.id ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  renameItem(item.id, editingName)
                }
                if (e.key === "Escape") {
                  setEditingFile(null)
                  setEditingName("")
                }
              }}
              onBlur={() => renameItem(item.id, editingName)}
              className="text-sm h-6 py-0 px-1"
              autoFocus
            />
          ) : (
            <span
              className={`flex-1 text-sm truncate ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              } ${selectedFileId === item.id ? "font-medium text-white" : ""}`}
            >
              {item.name}
              {item.isModified && <span className="text-orange-400 ml-1">●</span>}
            </span>
          )}

          {item.type === "folder" && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 hover:bg-slate-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNewItemInput({ type: "file", parentId: item.id })
                }}
                title="New File"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 hover:bg-slate-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNewItemInput({ type: "folder", parentId: item.id })
                }}
                title="New Folder"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>
          )}

          {item.type === "file" && item.isModified && (
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-600"
              onClick={(e) => {
                e.stopPropagation()
                saveFile(item.id)
              }}
              title="Save File"
            >
              <Save className="h-3 w-3 text-green-400" />
            </Button>
          )}
        </div>

        {/* New item input */}
        {showNewItemInput?.parentId === item.id && (
          <div className="ml-8 mt-1 mb-2">
            <div className="flex space-x-2">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`${showNewItemInput.type === "file" ? "filename.ext" : "folder name"}`}
                className={`text-sm ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-slate-800"
                }`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addNewItem(item.id, showNewItemInput.type)
                  }
                  if (e.key === "Escape") {
                    setShowNewItemInput(null)
                    setNewItemName("")
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={() => addNewItem(item.id, showNewItemInput.type)}
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowNewItemInput(null)
                  setNewItemName("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Render children */}
        {item.type === "folder" && item.isOpen && item.children && renderFileTree(item.children, level + 1)}
      </div>
    ))
  }

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`p-3 ${isDarkMode ? "border-slate-700" : "border-gray-200"} border-b`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`${isDarkMode ? "text-white" : "text-slate-800"} font-semibold text-sm`}>Project Files</h3>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewItemInput({ type: "file", parentId: "root" })}
              className={`h-6 w-6 p-0 ${
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"
              }`}
              title="New File"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewItemInput({ type: "folder", parentId: "root" })}
              className={`h-6 w-6 p-0 ${
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"
              }`}
              title="New Folder"
            >
              <FolderPlus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-7 text-sm ${
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-gray-300 text-slate-800 placeholder-gray-500"
            }`}
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* New item input at root level */}
        {showNewItemInput?.parentId === "root" && (
          <div className="mb-2">
            <div className="flex space-x-2">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`${showNewItemInput.type === "file" ? "filename.ext" : "folder name"}`}
                className={`text-sm ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-slate-800"
                }`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addNewItem("root", showNewItemInput.type)
                  }
                  if (e.key === "Escape") {
                    setShowNewItemInput(null)
                    setNewItemName("")
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={() => addNewItem("root", showNewItemInput.type)}
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowNewItemInput(null)
                  setNewItemName("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {renderFileTree(files)}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className={`fixed z-50 ${
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          } border rounded-lg shadow-lg py-1 min-w-[150px]`}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className={`w-full text-left px-3 py-2 text-sm ${
              isDarkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-gray-100"
            } flex items-center space-x-2`}
            onClick={() => {
              const file = findFileById(files, contextMenu.fileId)
              if (file) {
                setEditingFile(file.id)
                setEditingName(file.name)
              }
              setContextMenu(null)
            }}
          >
            <Edit3 className="h-3 w-3" />
            <span>Rename</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm ${
              isDarkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-gray-100"
            } flex items-center space-x-2`}
            onClick={() => {
              // Handle copy
              setContextMenu(null)
            }}
          >
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center space-x-2`}
            onClick={() => deleteItem(contextMenu.fileId)}
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}
