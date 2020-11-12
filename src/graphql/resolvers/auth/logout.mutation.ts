import { GQL_MutationResolvers } from '@app/graphql-schema-types';

export const logoutResolver: GQL_MutationResolvers['logout'] = async (_, __, { req }) => {
  const isLoggedIn = !!req.user;
  req.logout();

  return isLoggedIn;
};
