// src/lib/auth.ts
import crypto from 'crypto';
import redisClient from './redis';

/**
 * Generates a secure 6‑digit numeric OTP.
 */
export function generateOtp(): string {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}

/**
 * Stores OTP in Redis with a short TTL (5 minutes).
 * The key pattern is `otp:{identifier}` where identifier can be email or phone.
 */
export async function storeOtp(identifier: string, otp: string): Promise<void> {
  const key = `otp:${identifier}`;
  await redisClient.set(key, otp, 'EX', 300); // 300 seconds = 5 minutes
}

/**
 * Verifies an OTP against the stored value.
 * Returns true if match and deletes the key; false otherwise.
 */
export async function verifyOtp(identifier: string, otp: string): Promise<boolean> {
  const key = `otp:${identifier}`;
  const stored = await redisClient.get(key);
  if (stored && stored === otp) {
    await redisClient.del(key);
    return true;
  }
  return false;
}
