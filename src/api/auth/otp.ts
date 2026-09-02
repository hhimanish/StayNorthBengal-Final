// src/api/auth/otp.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, storeOtp } from '@/lib/auth';
import { sendEmailOtp, sendSmsOtp } from '@/lib/notification'; // placeholder utils
import { limitRate } from '@/lib/rateLimiter';

/**
 * POST /api/auth/otp
 * Body: { identifier: string, method: 'email' | 'sms' }
 * Returns: { success: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const { identifier, method } = await req.json();
    if (!identifier || !method) {
      return NextResponse.json({ error: 'Missing identifier or method' }, { status: 400 });
    }
    // Rate limit: max 5 OTP requests per hour per identifier
    const allowed = await limitRate('otp', identifier, 5, 3600);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many OTP requests, try later' }, { status: 429 });
    }

    const otp = generateOtp();
    await storeOtp(identifier, otp);
    // Dispatch OTP via chosen channel
    if (method === 'email') {
      await sendEmailOtp(identifier, otp);
    } else if (method === 'sms') {
      await sendSmsOtp(identifier, otp);
    } else {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OTP generation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
