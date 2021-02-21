import cors, { CorsOptions } from 'cors';
import { env } from '@/config/environment';
import { RequestHandler } from 'express';

export const corsMiddleware = (): RequestHandler => {
  // Refer to the docs on what works for your use cases. https://github.com/expressjs/cors#readme
  const whitelist = [];

  if (!env.isProduction) {
    whitelist.push(/localhost/);
  }

  const corsOptions: CorsOptions = {
    origin: whitelist,
  };

  return cors(corsOptions);
};
