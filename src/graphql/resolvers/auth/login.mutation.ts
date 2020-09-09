import { GQL_MutationResolvers } from 'graphql-resolvers';
import { AuthenticationError } from 'apollo-server-core';
import { logger } from '@app/utils';
import { createGQL_User } from '@app/core/factories/graphql';

export const loginResolver: GQL_MutationResolvers['login'] = async (_, args, { services, req }) => {
  const { authService } = services;
  const { usernameOrEmail, password } = args.input;

  try {
    const user = await authService.login(usernameOrEmail, password);

    if (user) {
      // Logout previous session
      if (req.isAuthenticated()) {
        req.logout();
      }

      // Invoke PassportJS login method to set up session
      req.login(user, (err) => {
        if (err) {
          logger.error(err.message);
        }
      });
    }

    return {
      user: createGQL_User(user),
    };
  } catch (err) {
    throw new AuthenticationError(err.message);
  }
};
