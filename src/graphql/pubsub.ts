/* eslint-disable @typescript-eslint/naming-convention */
import { PubSubEngine } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createRedisClient } from '@/redis/client';

// If you prefer a different PubSub implementation see:
// https://www.apollographql.com/docs/apollo-server/data/subscriptions/#pubsub-implementations
export const pubSubEngine: PubSubEngine = new RedisPubSub({
  publisher: createRedisClient(),
  subscriber: createRedisClient(),
});
