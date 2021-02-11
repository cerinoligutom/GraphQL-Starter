import { createDataLoader } from '@/utils';
import * as coreServices from '@/core/services';

export const userByIdLoader = ({ userService }: typeof coreServices) => {
  return createDataLoader(async (ids: string[]) => {
    const rows = await userService.getByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
};
