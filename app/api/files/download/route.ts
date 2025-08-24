// app/api/files/download/route.ts
export const runtime = 'nodejs'; // Required for Node modules (fs, archiver)

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import connectDB from '../../../utils/connectDB';
import { verifyToken } from '../../../utils/authMiddleware';
import { getUserFolder } from '../../../utils/fileHelpers';
import File from '../../../../models/File';

export async function POST(req: NextRequest) {
  await connectDB();

  const user = await verifyToken(req);
  if (!user || !user._id) return user;

  try {
    const { type, fileId, folderName } = await req.json();

    if (type === 'single') {
      if (!fileId) return NextResponse.json({ success: false, message: 'File ID required' }, { status: 400 });

      const file = await File.findOne({ _id: fileId, owner: user._id });
      if (!file) return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });

      const fileBuffer = fs.readFileSync(file.path);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${path.basename(file.path)}"`,
        },
      });
    } 
    else if (type === 'folder') {
      if (!folderName) return NextResponse.json({ success: false, message: 'Folder name required' }, { status: 400 });

      const userFolder = getUserFolder(user._id.toString());
      const folderPath = path.join(userFolder, folderName);
      if (!fs.existsSync(folderPath)) return NextResponse.json({ success: false, message: 'Folder not found' }, { status: 404 });

      const zipName = `${folderName}.zip`;
      const zipPath = path.join(userFolder, zipName);

      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);
      archive.directory(folderPath, false);
      await archive.finalize();

      // Wait until zip file is ready
      await new Promise<void>((resolve, reject) => {
        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));
      });

      const zipBuffer = fs.readFileSync(zipPath);
      fs.unlinkSync(zipPath); // delete zip after sending

      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${zipName}"`,
        },
      });
    } 
    else {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST /api/files/download error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
