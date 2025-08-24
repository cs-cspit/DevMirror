"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [status, setStatus] = useState("Verifying...")

  useEffect(() => {
    const verify = async () => {
      if (!token || !email) {
        setStatus("Invalid verification link")
        return
      }

      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        })

        const data = await res.json()

        if (!res.ok) {
          setStatus(data.error || "Verification failed")
        } else {
          setStatus("✅ Email verified successfully! Redirecting...")
          setTimeout(() => router.push("/auth"), 2000) // redirect to login page
        }
      } catch (err) {
        setStatus("Something went wrong. Try again later.")
      }
    }

    verify()
  }, [token, email, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-xl">{status}</h1>
    </div>
  )
}
