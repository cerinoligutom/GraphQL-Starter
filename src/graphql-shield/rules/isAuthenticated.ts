import { rule } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';
import { IGraphQLContext } from '@app/graphql';

export const isAuthenticated = rule()(async (parent, args, ctx: IGraphQLContext) => {
  if (ctx.userId === null) {
    return new AuthenticationError('Unauthenticated. Please try to log in.');
  }

  return true;
});
