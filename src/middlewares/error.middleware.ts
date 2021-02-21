import { ErrorRequestHandler } from 'express';
import { env } from '@/config/environment';
import { BaseError } from '@/errors/base.error';

export const errorMiddleware = (): ErrorRequestHandler => (err: BaseError, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  // All HTTP requests must have a response, so let's send back an error with its status code and message
  res.status(err?.httpStatusCode ?? 500).send({
    message: env.isProduction ? 'Oops! Something went wrong.' : err.message,
    errorCodename: err.errorCodename,
    data: err.payload,
    stacktrace: env.isProduction ? undefined : err.stack,
  });

  next(err);
};
