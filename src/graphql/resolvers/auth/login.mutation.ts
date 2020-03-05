import { GQL_MutationResolvers } from 'graphql-resolvers';
import { AuthenticationError } from 'apollo-server-core';
import { sendRefreshToken } from '@app/utils';

export const loginResolver: GQL_MutationResolvers['login'] = async (_, args, { services, res }) => {
  const { authService } = services;
  const { usernameOrEmail, password } = args.input;

  try {
    const result = await authService.login(usernameOrEmail, password);

    // Set refresh token in cookie
    const refreshToken = authService.createRefreshToken(result.user);
    sendRefreshToken(res, refreshToken);

    return result;
  } catch (err) {
    throw new AuthenticationError(err.message);
  }
};
