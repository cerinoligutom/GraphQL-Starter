import cors, { CorsOptions } from 'cors';

export const corsMiddleware = () => {
  // Refer to the docs on what works for your use cases. https://github.com/expressjs/cors#readme
  const corsOptions: CorsOptions = {
    origin: '*',
  };

  return cors(corsOptions);
};
