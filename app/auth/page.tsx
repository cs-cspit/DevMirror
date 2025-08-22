"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const { status } = useSession()

  const handleAuth = async (type: "signin" | "signup") => {
    setIsLoading(true)
    setError("")
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      if (type === "signin") {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        })
      } else {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        })
      }
    }, 2000)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    try {
      await signIn("google")
    } catch (err) {
      setError("Google sign-in failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <Image src="/logo.png" alt="DevMirror" width={40} height={40} className="rounded-lg shadow-lg" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground drop-shadow-lg">DevMirror</h1>
              <p className="text-base text-muted-foreground font-medium">Professional Web Editor</p>
            </div>
          </Link>
        </div>
        <Card className="bg-white/10 backdrop-blur-md border-none shadow-2xl rounded-2xl transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-primary-foreground text-2xl font-bold">Welcome to DevMirror</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to your account or create a new one to start building
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background/60 rounded-lg mb-2">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground font-semibold transition-colors"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground font-semibold transition-colors"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-muted-foreground font-medium">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-background/80 border-border text-primary-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-muted-foreground font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="bg-background/80 border-border text-primary-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary pr-10 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => handleAuth("signin")}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-md py-2.5 font-semibold text-lg rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  ) : null}
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary-foreground underline underline-offset-4 transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="signup" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-muted-foreground font-medium">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="bg-background/80 border-border text-primary-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-muted-foreground font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-background/80 border-border text-primary-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-muted-foreground font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="bg-background/80 border-border text-primary-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary pr-10 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => handleAuth("signup")}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-md py-2.5 font-semibold text-lg rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  ) : null}
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/80 px-3 text-muted-foreground font-semibold tracking-wider">Or continue with</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground bg-background/70 shadow-sm transition-all duration-200 font-semibold rounded-lg"
                  disabled={isLoading || status === "loading"}
                  onClick={() => toast({ title: "GitHub sign-in coming soon!" })}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground bg-background/70 shadow-sm transition-all duration-200 font-semibold rounded-lg"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || status === "loading"}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {isLoading && status !== "authenticated" ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  ) : null}
                  Google
                </Button>
              </div>
              {error && (
                <div className="mt-6 text-destructive text-center text-sm font-semibold">{error}</div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-primary-foreground hover:text-primary underline underline-offset-4 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary-foreground hover:text-primary underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}