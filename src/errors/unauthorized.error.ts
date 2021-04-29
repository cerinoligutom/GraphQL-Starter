import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  constructor(message?: string, payload?: Record<string, any>) {
    super({
      errorCodename: 'UNAUTHORIZED',
      httpStatusCode: 403,
      message: message ?? 'Unauthorized. You are not allowed to perform this action.',
      payload,
    });
  }
}
