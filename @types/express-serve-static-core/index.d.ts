import type { SessionContainer } from 'supertokens-node/recipe/session';

declare global {
  namespace Express {
    export interface Request {
      session?: SessionContainer;
    }
  }
}
