"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // prevents SSR rendering

  return <AuthPageClient />
}

function AuthPageClient() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { toast } = useToast()
  const { status } = useSession()
  const router = useRouter()

  const [signinEmail, setSigninEmail] = useState("")
  const [signinPassword, setSigninPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

  // Redirect authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  // ----------------------
  // Handle Sign In
  // ----------------------
  const handleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email: signinEmail,
        password: signinPassword,
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
        toast({ title: "Error", description: res.error, variant: "destructive" })
      } else {
        toast({ title: "Welcome back!", description: "You have been signed in successfully." })
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError("Something went wrong")
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------
  // Handle Sign Up
  // ----------------------
  const handleSignUp = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Registration failed")

      toast({
        title: "Account created!",
        description: "Please check your email and verify your account before logging in.",
      })

      // ❌ DO NOT auto login
      setSignupName("")
      setSignupEmail("")
      setSignupPassword("")
    } catch (err: any) {
      setError(err.message)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // OAuth handlers
  const handleGoogleSignIn = () => signIn("google", { callbackUrl: "/dashboard" })
  const handleGithubSignIn = () => signIn("github", { callbackUrl: "/dashboard" })

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

        {/* Card with Tabs */}
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
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSignIn} disabled={isLoading} className="w-full">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSignUp} disabled={isLoading} className="w-full">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>

            {/* OAuth */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Button onClick={handleGithubSignIn} className="w-full" disabled={isLoading || status === "loading"}>
                <Github className="h-4 w-4 mr-2" /> GitHub
              </Button>
              <Button onClick={handleGoogleSignIn} className="w-full" disabled={isLoading || status === "loading"}>
                <Mail className="h-4 w-4 mr-2" /> Google
              </Button>
            </div>

            {error && <div className="mt-6 text-destructive text-center text-sm font-semibold">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
