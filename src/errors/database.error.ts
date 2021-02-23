import { BaseError, IBaseErrorConstructorArgs } from './base.error';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDatabaseErrorConstructorArgs extends Omit<IBaseErrorConstructorArgs, 'errorCodename'> {}

export class DatabaseError extends BaseError {
  constructor(args: IDatabaseErrorConstructorArgs) {
    super({
      ...args,
      errorCodename: 'DATABASE_ERROR',
    });
  }
}
