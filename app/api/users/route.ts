import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDB';
import User from '../../../models/User';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { name, email, username, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, username, password: hashed });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    return NextResponse.json({
      success: true,
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, username: newUser.username },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
