"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Code, Eye, Star, Download, Heart } from "lucide-react"
import Image from "next/image"

const allTemplates = [
  {
    id: "cyber-portfolio",
    title: "Cyber Portfolio",
    description: "Futuristic developer portfolio with neon effects and animations",
    category: "Portfolio",
    difficulty: "Intermediate",
    tags: ["CSS Grid", "Animations", "Responsive", "Dark Theme"],
    icon: <Code className="h-5 w-5" />,
    gradient: "from-cyan-500 to-blue-600",
    preview: "/placeholder.svg?height=300&width=400&text=Cyber+Portfolio",
    featured: true,
    downloads: 1250,
    likes: 89,
  },
  {
    id: "neon-landing",
    title: "Neon Landing Page",
    description: "High-converting landing page with cyberpunk aesthetics",
    category: "Landing",
    difficulty: "Beginner",
    tags: ["Flexbox", "Forms", "CTA", "Conversion"],
    icon: <Code className="h-5 w-5" />,
    gradient: "from-purple-500 to-pink-600",
    preview: "/placeholder.svg?height=300&width=400&text=Neon+Landing",
    downloads: 2100,
    likes: 156,
  },
  // Add more templates here...
]

const categories = ["All", "Portfolio", "Landing", "Dashboard", "Blog", "E-commerce", "Mobile", "Business"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen text-white flex flex-col overflow-auto">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-30"></div>
              <Image src="/logo.png" alt="DevMirror" width={40} height={40} className="relative rounded-xl shadow-md" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">DevMirror</h1>
              <p className="text-xs text-cyan-300/70">Templates</p>
            </div>
          </Link>
          <Link href="/editor">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none shadow-md transition-all">
              Create New
            </Button>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-5 w-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/60 border-cyan-500/30 text-cyan-100 placeholder-cyan-400/50 rounded-xl shadow-inner"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          {showFilters && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-cyan-300 font-medium mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "bg-cyan-500 text-white border-none" : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 bg-transparent"}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-cyan-300 font-medium mb-3">Difficulty</h4>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={selectedDifficulty === difficulty ? "bg-cyan-500 text-white border-none" : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 bg-transparent"}
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Results */}
        <div className="mb-6">
          <p className="text-cyan-300/70">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-auto" style={{maxHeight: '70vh'}}>
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group border border-gray-800 bg-[#23272f] hover:shadow-xl transition-all duration-300 rounded-xl shadow-md"
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-20`}></div>
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {template.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-100"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/20 bg-transparent"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center`}
                  >
                    {template.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-xs">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                <CardDescription className="text-cyan-100/70">{template.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-slate-700/50 text-cyan-300 border-slate-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-400 border-slate-600">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-cyan-400/70 mb-4">
                  <div className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {template.downloads}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {template.likes}
                  </div>
                </div>

                <Link href={`/editor?template=${template.id}`}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-100 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50 transition-all duration-300">
                    <Code className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No templates found</h3>
            <p className="text-cyan-100/70 mb-6">Try adjusting your search criteria or browse all templates</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSelectedDifficulty("All")
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}