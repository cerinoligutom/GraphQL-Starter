import { env } from '@/config/environment';
import { BaseError } from './base.error';

export class InternalServerError extends BaseError {
  constructor(originalError: Error) {
    super({
      errorCodename: 'INTERNAL_SERVER_ERROR',
      httpStatusCode: 500,
      message: 'An unknown error has occurred.',
      originalError,
    });

    // Obscure internal server errors on production
    if (env.isProduction) {
      this.message = 'Oops! Something went wrong.';
    }

    // You should probably contact the appropriate channels at this point
    // and decide on how to handle this particular error.
  }
}
