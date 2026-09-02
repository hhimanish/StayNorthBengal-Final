// src/api/auth/verify.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth';
import jwt from 'jsonwebtoken';

/**
 * POST /api/auth/verify
 * Body: { identifier: string, otp: string }
 * Returns: { token?: string, error?: string }
 * On success, a signed JWT is set in an HttpOnly cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const { identifier, otp } = await req.json();
    if (!identifier || !otp) {
      return NextResponse.json({ error: 'Missing identifier or otp' }, { status: 400 });
    }
    const valid = await verifyOtp(identifier, otp);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }
    // Create JWT payload – include identifier and role lookup (default GUEST)
    const token = jwt.sign({ identifier }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '7d',
    });
    const response = NextResponse.json({ token: true });
    // HttpOnly cookie for session persistence
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (err) {
    console.error('OTP verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
