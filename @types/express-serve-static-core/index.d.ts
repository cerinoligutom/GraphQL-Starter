import type { IContext } from '@/shared/interfaces';
import type { SessionContainer } from 'supertokens-node/recipe/session';

declare global {
  namespace Express {
    export interface Request {
      session?: SessionContainer;
      context: IContext;
    }
  }
}
