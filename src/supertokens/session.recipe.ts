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
  signOutFeature: {
    disableDefaultImplementation: true,
  },
});
