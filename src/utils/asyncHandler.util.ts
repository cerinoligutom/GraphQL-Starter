import { RequestHandler, Request, Response, NextFunction } from 'express';
import { logger } from './logger.util';

export const asyncHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
