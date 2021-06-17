import { ErrorRequestHandler } from 'express';
import { handleError } from '@/errors';

export const errorMiddleware = (): ErrorRequestHandler => (unknownError, req, res, next) => {
  if (!unknownError) {
    next();
    return;
  }

  const err = handleError(unknownError);

  res.status(err.httpStatusCode).send({
    message: err.message,
    code: err.errorCodename,
    data: err.payload,
    stacktrace: err.stack,
  });

  next(err);
};
