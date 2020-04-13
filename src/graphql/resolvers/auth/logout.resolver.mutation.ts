import { GQL_MutationResolvers } from 'graphql-resolvers';

export const logoutResolver: GQL_MutationResolvers['logout'] = async (_, __, { req }) => {
  const isLoggedIn = !!req.user;
  req.logout();

  return isLoggedIn;
};
