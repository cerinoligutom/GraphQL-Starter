import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const register: GQL_MutationResolvers['register'] = async (_, { input }, { services }) => {
  const { authService } = services;

  try {
    const user = await authService.register(input);
    return { success: !!user };
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
