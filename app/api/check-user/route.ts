import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return if email is verified
    return NextResponse.json({ isVerified: user.isVerified }, { status: 200 })
  } catch (err) {
    console.error("❌ Check user error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
