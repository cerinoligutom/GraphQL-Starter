import session from 'express-session';
import { env } from '@/config/environment';
import { sessionOptions } from '@/config/session-options';
import { redisClient } from '@/redis/client';
import { RedisStore as IRedisStore } from 'connect-redis';
import { RequestHandler } from 'express';

const RedisStore: IRedisStore = require('connect-redis')(session);

export const sessionMiddleware = (): RequestHandler => {
  return session({
    secret: sessionOptions.secret,
    saveUninitialized: false,
    resave: false,
    name: sessionOptions.name,
    cookie: {
      httpOnly: true,
      secure: env.isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: new RedisStore({
      client: redisClient,
    }),
  });
};
