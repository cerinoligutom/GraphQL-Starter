import { UnauthenticatedError } from '@/errors/index.js';
import { IContext } from '@/shared/interfaces/index.js';

export const checkAuthentication = async (ctx: IContext): Promise<IContext> => {
  // If needed, you can also check whether the user still exists in the database here
  if (!ctx.userId) {
    throw new UnauthenticatedError();
  }

  // Do not mix "Authentication" with "Authorization" as they are different things:
  // Authentication = Are you allowed here?
  // Authorization  = Are you allowed to do this?
  // The latter is more on access controls, look into RBAC, ABAC, PBAC.

  return ctx as never;
};
