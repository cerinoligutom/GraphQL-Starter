import { IContext } from '@/shared/interfaces';
import { UUIDv4 } from '@/shared/types';
import { createDataLoader } from '@/utils';
import { userService } from '../../services/user.service';

export const userByIdLoader = (ctx: IContext) =>
  createDataLoader(async (ids: UUIDv4[]) => {
    const rows = await userService.findByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
