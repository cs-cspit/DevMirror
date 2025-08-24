import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    return NextResponse.json({ message: "DB Connected ✅" });
  } catch (error) {
    return NextResponse.json({ error: "DB Connection Failed ❌", details: error });
  }
}
