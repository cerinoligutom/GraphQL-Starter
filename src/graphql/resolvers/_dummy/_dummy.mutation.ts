import { GQL_MutationResolvers } from 'graphql-resolvers';

export const _dummyResolver: GQL_MutationResolvers['_dummy'] = async (parent, args, context, gqlResolveInfo) => {
  return 'Dummy Mutation Resolver';
};
