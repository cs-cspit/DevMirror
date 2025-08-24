// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../utils/connectDB';
import { verifyToken } from '../../utils/authMiddleware';
import File from '../../../models/File';
import fs from 'fs';
import path from 'path';
import { getUserFolder } from '../../utils/fileHelpers';

export async function GET(req: NextRequest) {
  await connectDB();

  const user = await verifyToken(req);
  if (!user || !user._id) return user;

  try {
    // Optional: filter by projectId
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');

    const query: any = { owner: user._id };
    if (projectId) query.project = projectId;

    const files = await File.find(query).select('filename path createdAt').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('GET /api/files error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const user = await verifyToken(req);
  if (!user || !user._id) return user;

  try {
    const { fileId } = await req.json();
    if (!fileId) {
      return NextResponse.json({ success: false, message: 'File ID is required' }, { status: 400 });
    }

    const file = await File.findOne({ _id: fileId, owner: user._id });
    if (!file) {
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    // Delete file from filesystem safely
    const userFolder = getUserFolder(user._id.toString());
    const filePath = path.join(userFolder, path.basename(file.path));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete from DB
    await file.deleteOne();

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/files error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
