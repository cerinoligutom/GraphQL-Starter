import Redis from 'ioredis';
import { env } from '@app/config/environment';

// Note:
// Call the `exec()` method to get a Promise-based return

export const redisClient = new Redis(env.redisConnectionUrl);

export async function pingRedisDatabase() {
  try {
    await redisClient.ping();
    console.info('[OK] Redis DB');
    return Promise.resolve();
  } catch (err) {
    console.error('[FAIL] Redis DB');
    console.error(err);
    return Promise.reject(err);
  }
}
