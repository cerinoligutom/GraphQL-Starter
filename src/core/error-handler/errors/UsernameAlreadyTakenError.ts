import { ApolloError } from 'apollo-server-express';

export class UsernameAlreadyTakenError extends ApolloError {
  httpStatusCode = 409;

  constructor() {
    super('Username already taken', 'USERNAME_ALREADY_TOKEN');
  }
}
