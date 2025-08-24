// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '../../../utils/connectDB';
import { verifyToken } from '../../../utils/authMiddleware';
import File from '../../../../models/File';
import { getUserFolder } from '../../../utils/fileHelpers';

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await verifyToken(req);
  if (!user || !user._id) return user;

  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    const projectId = data.get('projectId') as string;

    if (!file) return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });

    const userFolder = getUserFolder(user._id.toString());
    const filePath = path.join(userFolder, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const newFile = await File.create({
      filename: file.name,
      path: filePath,
      owner: user._id,
      project: projectId || undefined,
    });

    return NextResponse.json({ success: true, file: newFile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
