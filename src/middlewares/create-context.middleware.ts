import { RequestHandler } from 'express';

/**
 * This middleware is what populates the `req.context` object.
 * */
export const createContextMiddleware = (): RequestHandler => (req, res, next) => {
  const userId = req.session?.getUserId() ?? null;

  // Centralize population of the context object to be passed in the use cases here.
  req.context = {
    req,
    res,
    userId,
  };

  next();
};
