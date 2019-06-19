import { userByIdLoader } from './user-by-id.dataloader';

export const initLoaders = () => {
  const loaders = {
    userById: userByIdLoader(),
  };

  return loaders;
};
