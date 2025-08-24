// app/utils/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const verifyJWT = (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded; // contains user id
  } catch (error) {
    return null;
  }
};

export const requireAuth = (req: NextRequest) => {
  const user = verifyJWT(req);
  if (!user) throw new Error('Unauthorized');
  return user;
};
