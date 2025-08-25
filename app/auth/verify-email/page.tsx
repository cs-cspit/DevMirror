"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")
  const email = params.get("email")

  const [message, setMessage] = useState("Verifying your email...")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!token || !email) {
      setMessage("Invalid verification link")
      setStatus("error")
      return
    }

    fetch(`/api/verify-email?token=${token}&email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error)
          setStatus("error")
        } else {
          setMessage(data.message)
          setStatus("success")
        }
      })
      .catch(() => {
        setMessage("Internal server error")
        setStatus("error")
      })
  }, [token, email])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 text-white">
      <Card className="max-w-md w-full bg-[#23272f] border border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl text-cyan-300">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Code2 className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
          <p className={`mb-6 ${status === "error" ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
          {status === "success" && (
            <Link href="/auth">
              <Button className="bg-green-600 hover:bg-green-500 text-white">
                Go to Sign In
              </Button>
            </Link>
          )}
          {status === "error" && (
            <Button
              className="bg-gray-700 hover:bg-gray-600 text-white"
              onClick={() => router.push("/auth")}
            >
              Back to Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
