import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json({ error: "Invalid verification link" }, { status: 400 });
    }

    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      return NextResponse.json({ error: "Invalid token or email" }, { status: 400 });
    }

    if (user.verificationTokenExpires < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return NextResponse.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.error("❌ Verification error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
