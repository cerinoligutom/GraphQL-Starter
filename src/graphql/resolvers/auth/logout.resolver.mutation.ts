import { GQL_MutationResolvers } from 'graphql-resolvers';

export const logoutResolver: GQL_MutationResolvers['logout'] = async (_, __, { req }) => {
  req.logout();

  return !!req.user;
};
