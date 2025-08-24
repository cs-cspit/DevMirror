import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { token, email } = await req.json()

    if (!token || !email) {
      return NextResponse.json({ error: "Token and email are required" }, { status: 400 })
    }

    const user = await User.findOne({ email, verificationToken: token })

    if (!user) {
      return NextResponse.json({ error: "Invalid token or email" }, { status: 400 })
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 })
  } catch (err) {
    console.error("❌ Verify email error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
