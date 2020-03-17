import Redis from 'ioredis';
import { env } from '@app/config/environment';

// Note:
// Call the `exec()` method to get a Promise-based return

export const redisClient = new Redis(env.redisUrl);
