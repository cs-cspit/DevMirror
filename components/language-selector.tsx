"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, FileText, Database, Smartphone, Globe, Cpu, Zap, ChevronDown, Plus, X } from "lucide-react"

interface Language {
  id: string
  name: string
  extension: string
  icon: React.ReactNode
  color: string
  category: string
  description: string
  popular: boolean
}

const languages: Language[] = [
  // Web Technologies
  {
    id: "html",
    name: "HTML",
    extension: ".html",
    icon: <Globe className="h-4 w-4" />,
    color: "from-orange-500 to-red-500",
    category: "Web",
    description: "Markup language for web pages",
    popular: true,
  },
  {
    id: "css",
    name: "CSS",
    extension: ".css",
    icon: <FileText className="h-4 w-4" />,
    color: "from-blue-500 to-cyan-500",
    category: "Web",
    description: "Styling language for web pages",
    popular: true,
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    icon: <Code className="h-4 w-4" />,
    color: "from-yellow-500 to-orange-500",
    category: "Web",
    description: "Dynamic programming language",
    popular: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    extension: ".ts",
    icon: <Code className="h-4 w-4" />,
    color: "from-blue-600 to-blue-700",
    category: "Web",
    description: "Typed JavaScript superset",
    popular: true,
  },
  {
    id: "react",
    name: "React JSX",
    extension: ".jsx",
    icon: <Code className="h-4 w-4" />,
    color: "from-cyan-400 to-blue-500",
    category: "Web",
    description: "React component files",
    popular: true,
  },
  {
    id: "vue",
    name: "Vue",
    extension: ".vue",
    icon: <Code className="h-4 w-4" />,
    color: "from-green-500 to-emerald-500",
    category: "Web",
    description: "Vue.js single file components",
    popular: false,
  },
  {
    id: "svelte",
    name: "Svelte",
    extension: ".svelte",
    icon: <Code className="h-4 w-4" />,
    color: "from-orange-600 to-red-600",
    category: "Web",
    description: "Svelte components",
    popular: false,
  },

  // Backend Languages
  {
    id: "python",
    name: "Python",
    extension: ".py",
    icon: <Cpu className="h-4 w-4" />,
    color: "from-green-600 to-blue-600",
    category: "Backend",
    description: "Versatile programming language",
    popular: true,
  },
  {
    id: "nodejs",
    name: "Node.js",
    extension: ".js",
    icon: <Zap className="h-4 w-4" />,
    color: "from-green-500 to-green-600",
    category: "Backend",
    description: "Server-side JavaScript",
    popular: true,
  },
  {
    id: "php",
    name: "PHP",
    extension: ".php",
    icon: <Code className="h-4 w-4" />,
    color: "from-purple-600 to-indigo-600",
    category: "Backend",
    description: "Server-side scripting",
    popular: true,
  },
  {
    id: "java",
    name: "Java",
    extension: ".java",
    icon: <Cpu className="h-4 w-4" />,
    color: "from-red-600 to-orange-600",
    category: "Backend",
    description: "Enterprise programming language",
    popular: true,
  },
  {
    id: "csharp",
    name: "C#",
    extension: ".cs",
    icon: <Code className="h-4 w-4" />,
    color: "from-purple-700 to-blue-700",
    category: "Backend",
    description: "Microsoft's programming language",
    popular: false,
  },
  {
    id: "go",
    name: "Go",
    extension: ".go",
    icon: <Zap className="h-4 w-4" />,
    color: "from-cyan-600 to-blue-600",
    category: "Backend",
    description: "Google's systems language",
    popular: false,
  },
  {
    id: "rust",
    name: "Rust",
    extension: ".rs",
    icon: <Cpu className="h-4 w-4" />,
    color: "from-orange-700 to-red-700",
    category: "Backend",
    description: "Systems programming language",
    popular: false,
  },
  {
    id: "ruby",
    name: "Ruby",
    extension: ".rb",
    icon: <Code className="h-4 w-4" />,
    color: "from-red-500 to-pink-500",
    category: "Backend",
    description: "Dynamic programming language",
    popular: false,
  },

  // Mobile Development
  {
    id: "swift",
    name: "Swift",
    extension: ".swift",
    icon: <Smartphone className="h-4 w-4" />,
    color: "from-orange-500 to-red-500",
    category: "Mobile",
    description: "iOS development language",
    popular: false,
  },
  {
    id: "kotlin",
    name: "Kotlin",
    extension: ".kt",
    icon: <Smartphone className="h-4 w-4" />,
    color: "from-purple-500 to-indigo-500",
    category: "Mobile",
    description: "Android development language",
    popular: false,
  },
  {
    id: "dart",
    name: "Dart",
    extension: ".dart",
    icon: <Smartphone className="h-4 w-4" />,
    color: "from-blue-500 to-cyan-500",
    category: "Mobile",
    description: "Flutter development language",
    popular: false,
  },

  // Database & Config
  {
    id: "sql",
    name: "SQL",
    extension: ".sql",
    icon: <Database className="h-4 w-4" />,
    color: "from-blue-600 to-indigo-600",
    category: "Database",
    description: "Database query language",
    popular: true,
  },
  {
    id: "json",
    name: "JSON",
    extension: ".json",
    icon: <FileText className="h-4 w-4" />,
    color: "from-yellow-600 to-orange-600",
    category: "Config",
    description: "Data interchange format",
    popular: true,
  },
  {
    id: "yaml",
    name: "YAML",
    extension: ".yml",
    icon: <FileText className="h-4 w-4" />,
    color: "from-green-600 to-teal-600",
    category: "Config",
    description: "Human-readable data format",
    popular: false,
  },
  {
    id: "xml",
    name: "XML",
    extension: ".xml",
    icon: <FileText className="h-4 w-4" />,
    color: "from-orange-600 to-red-600",
    category: "Config",
    description: "Markup language",
    popular: false,
  },
  {
    id: "markdown",
    name: "Markdown",
    extension: ".md",
    icon: <FileText className="h-4 w-4" />,
    color: "from-gray-600 to-slate-600",
    category: "Config",
    description: "Lightweight markup language",
    popular: true,
  },
]

const categories = ["All", "Web", "Backend", "Mobile", "Database", "Config"]

interface LanguageSelectorProps {
  selectedLanguages: string[]
  onLanguageToggle: (languageId: string) => void
  onLanguageAdd: (language: Language) => void
  isDarkMode?: boolean
}

export function LanguageSelector({
  selectedLanguages,
  onLanguageToggle,
  onLanguageAdd,
  isDarkMode = true,
}: LanguageSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLanguages = languages.filter((lang) => {
    const matchesCategory = selectedCategory === "All" || lang.category === selectedCategory
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularLanguages = languages.filter((lang) => lang.popular)
  const selectedLangObjects = languages.filter((lang) => selectedLanguages.includes(lang.id))

  return (
    <div className="relative">
      {/* Selected Languages Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedLangObjects.map((lang) => (
          <Badge
            key={lang.id}
            className={`bg-gradient-to-r ${lang.color} text-white border-0 px-3 py-1 flex items-center space-x-2 group hover:scale-105 transition-transform duration-200`}
          >
            {lang.icon}
            <span className="font-medium">{lang.name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onLanguageToggle(lang.id)}
              className="h-4 w-4 p-0 ml-2 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") setIsExpanded(!isExpanded)
          }}
          className={`transition-all duration-200 shadow-md border-2 ${isDarkMode ? "border-cyan-400/60 text-cyan-200 hover:bg-cyan-600/20 bg-slate-800/80" : "border-gray-400 text-gray-700 hover:bg-cyan-100 bg-white"} flex items-center space-x-2 rounded-lg focus:ring-2 focus:ring-cyan-400/60 focus:outline-none`}
          aria-expanded={isExpanded}
          aria-haspopup="listbox"
        >
          <Plus className="h-4 w-4" />
          <span>Add Language</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Language Selector Panel */}
      {isExpanded && (
        <Card
          className={`${isDarkMode ? "bg-slate-800/90 border-slate-700" : "bg-white border-gray-200"} backdrop-blur-sm shadow-2xl mb-4 max-h-96 overflow-hidden`}
        >
          <CardHeader className="pb-3">
            <CardTitle className={`${isDarkMode ? "text-white" : "text-slate-800"} text-lg flex items-center`}>
              <Code className="h-5 w-5 mr-2" />
              Select Programming Languages
            </CardTitle>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"} text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs ${
                    selectedCategory === category
                      ? "bg-cyan-500 text-white"
                      : isDarkMode
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-0 max-h-64 overflow-y-auto">
            {/* Popular Languages */}
            {selectedCategory === "All" && searchQuery === "" && (
              <div className="mb-6">
                <h4
                  className={`${isDarkMode ? "text-cyan-300" : "text-gray-700"} text-sm font-medium mb-3 flex items-center`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Popular Languages
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularLanguages.map((lang) => (
                    <Button
                      key={lang.id}
                      variant="outline"
                      size="sm"
                      onClick={() => onLanguageAdd(lang)}
                      disabled={selectedLanguages.includes(lang.id)}
                      className={`justify-start p-3 h-auto ${
                        selectedLanguages.includes(lang.id)
                          ? "opacity-50 cursor-not-allowed"
                          : isDarkMode
                            ? "border-slate-600 hover:bg-slate-700 text-slate-300"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${lang.color} flex items-center justify-center mr-3`}
                      >
                        {lang.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{lang.name}</div>
                        <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>
                          {lang.extension}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* All Languages */}
            <div>
              <h4 className={`${isDarkMode ? "text-cyan-300" : "text-gray-700"} text-sm font-medium mb-3`}>
                {selectedCategory === "All" ? "All Languages" : `${selectedCategory} Languages`}
              </h4>
              <div className="space-y-2">
                {filteredLanguages.map((lang) => (
                  <Button
                    key={lang.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onLanguageAdd(lang)}
                    disabled={selectedLanguages.includes(lang.id)}
                    className={`w-full justify-start p-3 h-auto rounded-lg shadow-sm border-2 ${selectedLanguages.includes(lang.id) ? "opacity-50 cursor-not-allowed border-gray-300" : isDarkMode ? "border-cyan-700 hover:bg-cyan-800/40 text-cyan-100" : "border-cyan-200 hover:bg-cyan-50 text-cyan-700"}`}
                    tabIndex={0}
                    onKeyDown={e => {
                      if ((e.key === "Enter" || e.key === " ") && !selectedLanguages.includes(lang.id)) onLanguageAdd(lang)
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${lang.color} flex items-center justify-center mr-3`}
                    >
                      {lang.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{lang.name}</div>
                        {lang.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"} mb-1`}>
                        {lang.extension} • {lang.category}
                      </div>
                      <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
                        {lang.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {filteredLanguages.length === 0 && (
              <div className="text-center py-8">
                <Code className={`h-12 w-12 ${isDarkMode ? "text-slate-600" : "text-gray-300"} mx-auto mb-3`} />
                <p className={`${isDarkMode ? "text-slate-500" : "text-gray-500"} text-sm`}>
                  No languages found matching your criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}