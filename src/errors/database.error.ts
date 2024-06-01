import { BaseError, IBaseErrorConstructorArgs } from './base.error.js';

interface IDatabaseErrorConstructorArgs extends Omit<IBaseErrorConstructorArgs, 'errorCodename'> {}

export class DatabaseError extends BaseError {
  constructor(args: IDatabaseErrorConstructorArgs) {
    super({
      ...args,
      errorCodename: 'DATABASE_ERROR',
    });
  }
}
