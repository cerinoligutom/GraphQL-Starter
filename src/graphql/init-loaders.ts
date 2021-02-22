import { userByIdLoader } from '@/modules/user/graphql/dataloaders';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initLoaders = () => {
  const loaders = {
    userById: userByIdLoader(),
  };

  return loaders;
};
