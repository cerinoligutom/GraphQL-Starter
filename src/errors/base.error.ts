interface IBaseErrorConstructorArgs {
  errorCodename: string;
  message: string;
  httpStatusCode: number;
  payload?: any;
}
export class BaseError extends Error {
  httpStatusCode: number;
  payload?: any;
  errorCodename: string;

  constructor(args: IBaseErrorConstructorArgs) {
    super(args.message);

    this.name = 'BaseError';

    this.errorCodename = args.errorCodename;
    this.httpStatusCode = args.httpStatusCode;
    this.payload = args.payload;

    // If desired, you could notify certain channels
    // on your organization here by extending the "args"
    // and doing a conditional here based on your needs such as
    // sending an email to system admins or developers that
    // something went wrong since a certain error happened.
  }
}
