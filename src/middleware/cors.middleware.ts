import cors, { CorsOptions } from 'cors';
import { env } from '@app/config/environment';

export const corsMiddleware = () => {
  // Refer to the docs on what works for your use cases. https://github.com/expressjs/cors#readme
  const whitelist = [];

  if (!env.isProduction) {
    whitelist.push(/localhost/);
  }

  const corsOptions: CorsOptions = {
    origin: whitelist,

    // Note:
    // Don't forget to set your http client to set
    // "credentials" to "include".
    credentials: true,
  };

  return cors(corsOptions);
};
