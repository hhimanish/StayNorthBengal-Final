// src/lib/redis.ts
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis;

if (process.env.NODE_ENV === 'production') {
  redisClient = new Redis(redisUrl);
} else {
  if (!(global as any).redis) {
    (global as any).redis = new Redis(redisUrl);
  }
  redisClient = (global as any).redis;
}

import { randomBytes } from 'crypto';

/** Acquire a Redis lock (SET NX PX) */
export async function acquireLock(key:string, ttlSeconds:number):Promise<string|null>{
  const token = randomBytes(16).toString('hex');
  const result = await redisClient.set(key, token, 'EX', ttlSeconds, 'NX');
  return result === 'OK' ? token : null;
}

/** Release a Redis lock only if token matches */
export async function releaseLock(key:string, token:string):Promise<boolean>{
  const script = `
    if (redis.call('get', KEYS[1]) === ARGV[1]) then
      return redis.call('del', KEYS[1])
    else
      return 0
    end`;
  const result = await redisClient.eval(script, 1, key, token);
  return result === 1;
}

export default redisClient;
