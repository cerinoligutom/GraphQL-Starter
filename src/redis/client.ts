import Redis from 'ioredis';
import { env } from '@/config/environment';

// Call the `exec()` method to get a Promise-based return

export function createRedisClient(): Redis {
  return new Redis(env.redisConnectionUrl);
}

export const redisClient = createRedisClient();

export async function ping(): Promise<void> {
  try {
    await redisClient.ping();
    console.info('[OK] Redis DB');
    return await Promise.resolve();
  } catch (err) {
    console.error('[FAIL] Redis DB');
    console.error(err);
    return Promise.reject(err);
  }
}
