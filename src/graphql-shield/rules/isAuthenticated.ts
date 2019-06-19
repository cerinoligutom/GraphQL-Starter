import { rule } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';

export const isAuthenticated = rule()(async (parent, args, ctx) => {
  if (ctx.userId === null) {
    return new AuthenticationError('Unauthenticated. Please try to log in.');
  }

  return true;
});
