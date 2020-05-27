import session from 'express-session';
import { env } from '@app/config/environment';
import { sessionOptions } from '@app/config/session-options';
import { redisClient } from '../redis/client';
import { RedisStore as IRedisStore } from 'connect-redis';
const RedisStore: IRedisStore = require('connect-redis')(session);

export const sessionMiddleware = () => {
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
