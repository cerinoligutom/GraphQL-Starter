import { userService } from '@app/core/services';
import DataLoader from 'dataloader';

export const userByIdLoader = () => {
  return new DataLoader(async (ids: string[]) => {
    const rows = await userService.getByIds(ids);

    return ids.map(id => rows.find(row => row.id === id) || null);
  });
};
