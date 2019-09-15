import { QueryResolvers } from 'graphql-resolvers';

export const _dummy: QueryResolvers['_dummy'] = async (parent, args, context, gqlResolveInfo) => {
  return 'Dummy Query Resolver';
};
