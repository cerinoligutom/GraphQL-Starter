import { BaseError } from './base.error.js';

export class BadInputError extends BaseError {
  constructor(payload: Record<string, string[] | undefined>) {
    super({
      errorCodename: 'BAD_INPUT',
      httpStatusCode: 422,
      message: 'The server cannot process your input.',
      payload,
    });
  }
}
