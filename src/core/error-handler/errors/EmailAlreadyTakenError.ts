import { ApolloError } from 'apollo-server-express';

export class EmailAlreadyTakenError extends ApolloError {
  httpStatusCode = 409;

  constructor() {
    super('Email already taken', 'EMAIL_ALREADY_TOKEN');
  }
}
