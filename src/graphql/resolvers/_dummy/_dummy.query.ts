import { GQL_QueryResolvers } from 'graphql-resolvers';

export const _dummyResolver: GQL_QueryResolvers['_dummy'] = async (parent, args, context, gqlResolveInfo) => {
  return 'Dummy Query Resolver';
};
