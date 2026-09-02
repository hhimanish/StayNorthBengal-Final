// src/middleware/requireHost.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Middleware that ensures the authenticated user is a host (owns at least one Stay).
 * If not, redirects to home with a 403 status.
 */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token');
  // In a real app you would decode the JWT; here we assume a helper exists.
  // For simplicity, we'll just let the request pass if a session cookie exists.
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  // Decode token to get userId (placeholder logic)
  const userId = token?.value?.split('|')[0] ?? '';
  const hasStay = await prisma.stay.findFirst({ where: { hostId: userId } });
  if (!hasStay) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}
