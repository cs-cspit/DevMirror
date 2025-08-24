// utils/fileHelpers.ts
import fs from 'fs';
import path from 'path';

const FILES_DIR = path.join(process.cwd(), 'files');

/**
 * Returns the folder path for a specific user.
 * Creates the folder if it doesn't exist.
 * @param userId - The MongoDB user ID
 * @returns full path to the user's folder
 */
export function getUserFolder(userId: string): string {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const userFolder = path.join(FILES_DIR, userId);

  try {
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating user folder:', err);
    throw new Error('Could not create user folder');
  }

  return userFolder;
}
