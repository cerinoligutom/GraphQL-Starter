import { RequestHandler, Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
      next();
    } catch (err) {
      next(err);
    }
  };
};
