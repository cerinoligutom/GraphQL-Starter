import { GQL_MutationResolvers } from '@/generated/graphql';
import { ValidationError } from 'apollo-server-core';

export const registerResolver: GQL_MutationResolvers['register'] = async (_, { input }, { services }) => {
  const { authService } = services;

  try {
    const user = await authService.register(input);
    return { success: !!user };
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
