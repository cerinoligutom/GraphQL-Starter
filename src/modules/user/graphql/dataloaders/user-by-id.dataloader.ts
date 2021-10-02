import { UserModel } from '@/db/models';
import { IContext } from '@/shared/interfaces';
import { UniqueID } from '@/shared/types';
import { createDataLoader } from '@/utils';

export const userByIdLoader = (ctx: IContext) => {
  return createDataLoader(async (ids: UniqueID[]) => {
    const rows = await UserModel.query().findByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
};
