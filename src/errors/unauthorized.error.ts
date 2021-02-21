import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super({
      errorCodename: 'UNAUTHORIZED',
      httpStatusCode: 403,
      message: message ?? 'Unauthorized. You are not allowed to perform this action.',
    });

    this.name = 'UnauthorizedError';
  }
}