import { IContext } from '@/shared/interfaces/index.js';
import { createDataLoader } from '@/utils/create-dataloader.util.js';
import { userService } from '../../services/user.service.js';

export const userByIdLoader = (ctx: IContext) =>
  createDataLoader(async (ids: string[]) => {
    const rows = await userService.findByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
