"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Play,
  Code2,
  Palette,
  Smartphone,
  ShoppingCart,
  FileText,
  BarChart3,
  Zap,
  Eye,
  Star,
  Github,
  Twitter,
  Linkedin,
  LogOut,
  User
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

const templates = [
  {
    id: "portfolio",
    title: "Portfolio Website",
    description: "Professional portfolio template for developers and designers",
    category: "Portfolio",
    difficulty: "Beginner",
    tags: ["Responsive", "Modern", "Clean"],
    icon: <Code2 className="h-5 w-5" />,
    preview: "/placeholder.svg?height=200&width=300&text=Portfolio",
    featured: true,
  },
  {
    id: "landing",
    title: "SaaS Landing Page",
    description: "High-converting landing page for software products",
    category: "Landing",
    difficulty: "Intermediate",
    tags: ["Conversion", "Modern", "Professional"],
    icon: <Zap className="h-5 w-5" />,
    preview: "/placeholder.svg?height=200&width=300&text=SaaS+Landing",
  },
  {
    id: "dashboard",
    title: "Admin Dashboard",
    description: "Complete dashboard with charts and data visualization",
    category: "Dashboard",
    difficulty: "Advanced",
    tags: ["Charts", "Data", "Interactive"],
    icon: <BarChart3 className="h-5 w-5" />,
    preview: "/placeholder.svg?height=200&width=300&text=Dashboard",
    featured: true,
  },
  {
    id: "blog",
    title: "Blog Template",
    description: "Clean and readable blog template with modern typography",
    category: "Blog",
    difficulty: "Beginner",
    tags: ["Typography", "Content", "SEO"],
    icon: <FileText className="h-5 w-5" />,
    preview: "/placeholder.svg?height=200&width=300&text=Blog",
  },
  {
    id: "ecommerce",
    title: "E-commerce Store",
    description: "Complete online store with shopping cart and checkout",
    category: "E-commerce",
    difficulty: "Advanced",
    tags: ["Shopping", "Payment", "Responsive"],
    icon: <ShoppingCart className="h-5 w-5" />,
    preview: "/placeholder.svg?height=200&width=300&text=E-commerce",
    featured: true,
  },
  {
    id: "mobile",
    title: "Mobile App Landing",
    description: "App showcase landing page with download links",
    category: "Mobile",
    difficulty: "Intermediate",
    tags: ["Mobile", "App", "Showcase"],
    icon: <Smartphone className="h-5 w-5" />,
    preview: "/placeholder.svg?height=200&width=300&text=Mobile+App",
  },
]

const categories = ["All", "Portfolio", "Landing", "Dashboard", "Blog", "E-commerce", "Mobile"]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { data: session } = useSession()

  const filteredTemplates =
    selectedCategory === "All" ? templates : templates.filter((template) => template.category === selectedCategory)

  const featuredTemplates = templates.filter((template) => template.featured)

  return (
    <div className="min-h-screen text-white flex flex-col overflow-auto">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="DevMirror" width={32} height={32} className="rounded-lg shadow-md" />
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                DevMirror
              </h1>
              <p className="text-xs text-cyan-300/70">Professional Web Editor</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/editor" className="text-cyan-300 hover:text-white font-medium transition-colors">
              Editor
            </Link>
            <Link href="/templates" className="text-cyan-300 hover:text-white font-medium transition-colors">
              Templates
            </Link>
            <Link href="/dashboard" className="text-cyan-300 hover:text-white font-medium transition-colors">
              Dashboard
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-cyan-300">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || session.user?.email}</span>
                </div>
                <Button
                  onClick={() => signOut({ callbackUrl: "/auth" })}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth" className="text-cyan-300 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
            )}
          </nav>

          <Link href="/editor">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none shadow-md transition-all">
              <Code2 className="mr-2 h-4 w-4" />
              Launch Editor
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              Build Professional
              <br />
              <span className="text-cyan-300/80">Websites Faster</span>
            </h2>
            <p className="text-xl text-cyan-200/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              Choose from our collection of professionally designed templates. From portfolios to e-commerce stores, get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/templates">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-3 border-none shadow-md transition-all"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Browse Templates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {!session && (
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 border-cyan-500/30 bg-transparent text-cyan-200 hover:bg-cyan-500/10 hover:text-white"
                  >
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-2">50+</div>
                <div className="text-cyan-400 text-sm">Premium Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-2">100K+</div>
                <div className="text-cyan-400 text-sm">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-2">24/7</div>
                <div className="text-cyan-400 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-silver-100 mb-4">Featured Templates</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Hand-picked templates that showcase modern design and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-xl transition-shadow duration-300 bg-gray-900 border-gray-800"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" className="bg-gray-800 text-silver-100 hover:bg-gray-700 border border-gray-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
                      {template.icon}
                    </div>
                    <Badge variant="outline" className="border-gray-700 text-gray-400">
                      {template.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-silver-100 text-lg">{template.title}</CardTitle>
                  <CardDescription className="text-gray-400">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-800 text-gray-300 border-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/editor?template=${template.id}`}>
                    <Button className="w-full bg-gray-700 hover:bg-gray-600 text-silver-100 border border-gray-600">
                      <Code2 className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Templates */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-silver-100 mb-4">All Templates</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore our complete collection of professional website templates
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gray-700 text-silver-100 border-gray-600"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300 bg-transparent"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-xl transition-shadow duration-300 bg-gray-800 border-gray-700"
              >
                <div className="relative h-40 overflow-hidden rounded-t-lg">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {template.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" className="bg-gray-800 text-silver-100 hover:bg-gray-700 border border-gray-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300">
                      {template.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-500 text-xs">
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-silver-100 text-base">{template.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-700 text-gray-300 border-gray-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-500 border-gray-600">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/editor?template=${template.id}`}>
                    <Button
                      size="sm"
                      className="w-full bg-gray-700 hover:bg-gray-600 text-silver-100 border border-gray-600"
                    >
                      <Code2 className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold text-silver-100 mb-6">Ready to Build Something Great?</h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Choose from our collection of professional templates and start building your website today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-gray-700 hover:bg-gray-600 text-silver-100 px-8 py-3 border border-gray-600"
                >
                  <Code2 className="mr-2 h-5 w-5" />
                  Start Building
                </Button>
              </Link>

              {!session && (
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-silver-100 px-8 py-3 bg-transparent"
                  >
                    Get Pro Access
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Image src="/logo.png" alt="DevMirror" width={32} height={32} className="rounded-lg shadow-md" />
            <p className="text-gray-400 text-sm">© 2025 DevMirror. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
