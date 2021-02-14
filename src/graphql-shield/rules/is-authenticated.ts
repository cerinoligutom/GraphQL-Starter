import { rule } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';
import { IGraphQLContext } from '@/graphql';

export const isAuthenticated = rule()(async (parent, args, ctx: IGraphQLContext) => {
  if (!ctx.req.isAuthenticated()) {
    return new AuthenticationError('Unauthenticated.');
  }

  // At this point, you're guaranteed that you're authenticated so we return true directly.
  return true;
});
