// src/lib/rateLimiter.ts
import redisClient from './redis';

/**
 * Simple token bucket rate limiter stored in Redis.
 * Prefix identifies the bucket (e.g., 'otp', 'lock_attempt')
 * `limit` is max tokens per `windowSec` seconds.
 */
export async function limitRate(prefix: string, identifier: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `${prefix}:${identifier}`;
  const current = await redisClient.incr(key);
  if (current === 1) {
    await redisClient.expire(key, windowSec);
  }
  if (current > limit) {
    return false; // over limit
  }
  return true; // allowed
}

export async function getRemaining(prefix: string, identifier: string, limit: number, windowSec: number): Promise<number> {
  const key = `${prefix}:${identifier}`;
  const ttl = await redisClient.ttl(key);
  const count = await redisClient.get(key);
  const used = count ? parseInt(count, 10) : 0;
  return Math.max(limit - used, 0);
}
