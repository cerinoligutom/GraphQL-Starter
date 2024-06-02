import { userByIdLoader } from '@/modules/user/graphql/dataloaders/index.js';
import { IContext } from '@/shared/interfaces/index.js';

export const initLoaders = (ctx: IContext) => {
  const loaders = {
    userById: userByIdLoader(ctx),
  };

  return loaders;
};
