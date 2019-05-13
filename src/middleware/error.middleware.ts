import { Request, Response, NextFunction } from 'express';
import { env } from '@app/config/environment';

export const errorMiddleware = () => (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log message error in our server's console
  console.error(err.message);

  // All HTTP requests must have a response, so let's send back an error with its status code and message
  res.status(500).send({
    errors: {
      message: env.isProduction ? 'Oops. Something went wrong.' : err.message,
      data: env.isProduction ? {} : err,
    },
  });
};
