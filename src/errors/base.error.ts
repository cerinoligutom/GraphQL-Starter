import { v4 as uuidV4 } from 'uuid';

interface IDefaultPayload {
  $errorId: string;
}

export interface IBaseErrorConstructorArgs {
  /**
   * Custom Codename for your error. Suggested naming convention would be in UPPER_SNAKE_CASE.
   */
  errorCodename: string;

  /**
   * General Error message.
   */
  message: string;

  /**
   * Will be used by REST endpoints.
   */
  httpStatusCode: number;

  /**
   * Any extra data that could be useful for the consumer.
   */
  payload?: Record<string, any>;

  /**
   * If the error is from a 3rd party or you're wrapping other errors, make sure to pass it here.
   */
  originalError?: Error;
}
export class BaseError extends Error {
  readonly errorId: string;
  readonly httpStatusCode: number;
  readonly payload?: Readonly<IDefaultPayload> & Record<string, any>;
  readonly errorCodename: string;
  readonly originalError?: Error;

  constructor(args: IBaseErrorConstructorArgs) {
    super(args.message);
    this.name = this.constructor.name;

    // For tracing on backend logs
    this.errorId = uuidV4();

    this.errorCodename = args.errorCodename;
    this.httpStatusCode = args.httpStatusCode;
    this.payload = {
      ...args.payload,
      $errorId: this.errorId,
    };
    this.originalError = args.originalError;

    // Always prepend the Error ID for tracing
    this.stack = `ErrorID: ${this.errorId}\n${this.stack}`;

    if (this.originalError) {
      this.stack = `${this.stack}\n${this.originalError.stack}`;
    }

    // If desired, you could notify certain channels
    // on your organization here by extending the "args"
    // and doing a conditional here based on your needs such as
    // sending an email to system admins or developers that
    // something went wrong since a certain error happened.
  }
}
