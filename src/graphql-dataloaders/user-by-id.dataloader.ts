import { createDataLoader } from '@app/utils';
import * as coreServices from '@app/core/services';

export const userByIdLoader = ({ userService }: typeof coreServices) => {
  return createDataLoader(async (ids: string[]) => {
    const rows = await userService.getByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
};
