import Session from 'supertokens-node/recipe/session';
import { UnauthenticatedError, UnauthorizedError } from '@/errors';

export const SessionRecipe = Session.init({
  errorHandlers: {
    onTokenTheftDetected: (sessionHandle, userId, req, res, next) => {
      next(
        new UnauthorizedError('Token theft detected.', {
          sessionHandle,
          userId,
        }),
      );
    },
    onUnauthorised: (message, req, res, next) => {
      next(new UnauthenticatedError());
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
