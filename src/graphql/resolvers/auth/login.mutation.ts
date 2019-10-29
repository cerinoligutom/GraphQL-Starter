import { GQL_MutationResolvers } from 'graphql-resolvers';
import { AuthenticationError } from 'apollo-server-core';

export const loginResolver: GQL_MutationResolvers['login'] = async (_, args, { services }) => {
  const { authService } = services;
  const { usernameOrEmail, password } = args.input;

  try {
    const result = await authService.login(usernameOrEmail, password);
    return result;
  } catch (err) {
    throw new AuthenticationError(err.message);
  }
};
