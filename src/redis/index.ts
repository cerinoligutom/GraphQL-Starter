import { Redis } from 'ioredis';
import { env } from '@/config/environment.js';

const redisClients: Redis[] = [];
export async function disconnectRedisClients() {
  await Promise.all(redisClients.map((client) => client.disconnect()));
}

// Call the `exec()` method to get a Promise-based return
export function createRedisClient(): Redis {
  const redisClient = new Redis(env.REDIS_CONNECTION_URL);

  redisClients.push(redisClient);

  return redisClient;
}

export const redisClient = createRedisClient();
