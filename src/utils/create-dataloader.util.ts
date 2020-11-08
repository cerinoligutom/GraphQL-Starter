import DataLoader from 'dataloader';

export const createDataLoader = <T>(cb: (ids: string[]) => Promise<T[]>): DataLoader<string, T, string> => {
  return new DataLoader<string, T>(async (ids) => cb(ids as string[]));
};
