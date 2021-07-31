import { UserModel } from '@/db/models';
import { NotFoundError } from '@/errors';
import { UniqueID } from '@/shared/types';

async function findByIdOrThrow(userId: UniqueID): Promise<UserModel> {
  const user = await UserModel.query().findById(userId);

  if (!user) {
    throw new NotFoundError(`User (${userId}) not found.`);
  }

  return user;
}

export const userService = {
  findByIdOrThrow,
};
