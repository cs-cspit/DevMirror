// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../utils/connectDB';
import User from '../../../../models/User';
import { requireAuth } from '../../../utils/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const decoded: any = requireAuth(req);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
