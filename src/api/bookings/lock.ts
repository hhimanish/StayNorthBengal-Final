// src/api/bookings/lock.ts
import { NextRequest, NextResponse } from 'next/server';
import redisClient from '@/lib/redis';
import { getToken } from '@/lib/auth-token';
import { v4 as uuidv4 } from 'uuid';

const LOCK_TTL_SECONDS = 600; // 10 minutes
const RATE_LIMIT_KEY_PREFIX = 'lock_attempts';
const RATE_LIMIT_MAX = 10; // per user per hour
const RATE_LIMIT_WINDOW = 3600; // seconds

/**
 * POST /api/bookings/lock
 * Body: { roomId: string }
 * Returns: { lockToken: string, expiresAt: string }
 */
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  const userId = token.sub;
  const { roomId } = await req.json();
  if (!roomId) {
    return NextResponse.json({ error: 'roomId required' }, { status: 400 });
  }

  // Rate limit check
  const rateKey = `${RATE_LIMIT_KEY_PREFIX}:${userId}`;
  const attempts = await redisClient.incr(rateKey);
  if (attempts === 1) {
    await redisClient.expire(rateKey, RATE_LIMIT_WINDOW);
  }
  if (attempts > RATE_LIMIT_MAX) {
    return NextResponse.json({ error: 'Too many lock attempts, please try later' }, { status: 429 });
  }

  // Acquire lock
  const lockToken = uuidv4();
  const lockKey = `room_lock:${roomId}`;
  const alreadyLocked = await redisClient.get(lockKey);
  if (alreadyLocked) {
    return NextResponse.json({ error: 'Room currently locked by another user' }, { status: 409 });
  }
  await redisClient.set(lockKey, lockToken, 'EX', LOCK_TTL_SECONDS);

  const expiresAt = new Date(Date.now() + LOCK_TTL_SECONDS * 1000).toISOString();
  return NextResponse.json({ lockToken, expiresAt });
}
