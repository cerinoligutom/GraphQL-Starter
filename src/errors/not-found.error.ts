import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(message?: string, payload?: Record<string, any>) {
    super({
      errorCodename: 'NOT_FOUND',
      httpStatusCode: 404,
      message: message ?? 'Not found.',
      payload,
    });
  }
}
