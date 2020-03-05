import { GQL_MutationResolvers } from 'graphql-resolvers';
import { sendRefreshToken } from '@app/utils';

export const logoutResolver: GQL_MutationResolvers['logout'] = async (_, __, { res }) => {
  // Set refresh token in cookie to empty string
  sendRefreshToken(res, '');

  return true;
};
