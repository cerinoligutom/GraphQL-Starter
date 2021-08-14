import { BaseError } from './base.error';

export class InternalServerError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super({
      errorCodename: 'INTERNAL_SERVER_ERROR',
      httpStatusCode: 500,
      message,
      originalError,
    });

    // You should probably contact the appropriate channels at this point
    // and decide on how to handle this particular error.
  }
}
