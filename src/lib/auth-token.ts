// src/lib/auth-token.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Extracts and verifies JWT from the HttpOnly `session` cookie.
 * Returns the decoded payload (any) or null if invalid/absent.
 */
export function getToken(req: NextRequest): { sub: string; identifier?: string } | null {
  const token = req.cookies.get('session')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    return payload;
  } catch (e) {
    console.error('JWT verification failed', e);
    return null;
  }
}
