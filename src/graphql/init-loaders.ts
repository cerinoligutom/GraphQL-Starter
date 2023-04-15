import { userByIdLoader } from '@/modules/user/graphql/dataloaders/index.js';
import { IContext } from '@/shared/interfaces/index.js';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initLoaders = (ctx: IContext) => {
  const loaders = {
    userById: userByIdLoader(ctx),
  };

  return loaders;
};
