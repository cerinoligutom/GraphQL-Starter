import Session from 'supertokens-node/recipe/session';
import { UnauthenticatedError, UnauthorizedError } from '@/errors';

export const SessionRecipe = Session.init({
  errorHandlers: {
    onTokenTheftDetected: (sessionHandle, userId, req, res) => {
      throw new UnauthorizedError('Token theft detected.', {
        sessionHandle,
        userId,
      });
    },
    onUnauthorised: (_, req, res) => {
      throw new UnauthenticatedError();
    },
  },
  // https://supertokens.io/docs/session/advanced-customizations/apis-override/usage
  override: {
    apis: (originalImplementation) => ({
      ...originalImplementation,
      // https://supertokens.io/docs/session/advanced-customizations/apis-override/disabling
      signOutPOST: undefined,
    }),
  },
});
