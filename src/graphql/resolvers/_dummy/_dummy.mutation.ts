import { MutationResolvers } from 'graphql-resolvers';

export const _dummy: MutationResolvers['_dummy'] = async (parent, args, context, gqlResolveInfo) => {
  return 'Dummy Mutation Resolver';
};
