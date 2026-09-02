// src/api/payments/wallet.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth-token';
import prisma from '@/lib/prisma';

/**
 * GET /api/payments/wallet
 * Returns the current wallet balance (in cents) for the authenticated user.
 */
export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const userId = token.sub;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const balanceCents = wallet?.balanceCents ?? 0;
  return NextResponse.json({ balanceCents });
}
