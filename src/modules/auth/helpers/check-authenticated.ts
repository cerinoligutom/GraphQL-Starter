import { UnauthenticatedError } from '@/errors';
import { IContext } from '@/shared/interfaces';

export const checkAuthentication = (ctx: IContext): void => {
  if (!ctx.userId) {
    throw new UnauthenticatedError();
  }
};
