import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token and expiration (24 hours)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    // Build base URL (local or deployed)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Construct the verification link
    const verifyUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}&email=${email}`;

    // Send verification email
    await sendVerificationEmail(email, verificationToken, baseUrl);

    return NextResponse.json(
      { message: "User created! Check your email to verify your account." },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Signup error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
