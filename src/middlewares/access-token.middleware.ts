import { processAccessTokenFromAuthHeader } from '@/shared/helpers';
import { UniqueID } from '@/shared/types';
import { RequestHandler } from 'express';

export const accessTokenHandler = (): RequestHandler => {
  const handler: RequestHandler = (req, res, next) => {
    const payload = processAccessTokenFromAuthHeader(req);

    req.userId = payload?.userId ?? null;

    next();
  };

  return handler;
};

declare module 'express-serve-static-core' {
  interface Request {
    userId?: UniqueID | null;
  }
}
