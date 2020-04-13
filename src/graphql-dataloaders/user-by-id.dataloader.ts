import { userService } from '@app/core/services';
import { createDataLoader } from '@app/utils';

export const userByIdLoader = () => {
  return createDataLoader(async (ids: string[]) => {
    const rows = await userService.getByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
};
