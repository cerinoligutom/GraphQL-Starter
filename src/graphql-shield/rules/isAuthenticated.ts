import { rule } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';
import { IGraphQLContext } from '@app/graphql';
import { authService } from '@app/core/services';

export const isAuthenticated = rule()(async (parent, args, ctx: IGraphQLContext) => {
  const { authorization } = ctx.req.headers;

  if (!authorization) {
    return new AuthenticationError('Unauthenticated.');
  }

  const payload = authService.validateAccessToken(authorization);
  ctx.payload = payload;

  return true;
});
