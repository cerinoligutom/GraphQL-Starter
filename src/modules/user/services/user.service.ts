import type { Selectable } from 'kysely';
import type { UUIDv4 } from '@/shared/types';
import type { User } from '@/db/types';
import { db } from '@/db';
import { NotFoundError } from '@/errors';

async function findByIdOrThrow(userId: UUIDv4): Promise<Selectable<User>> {
  const user = await db.selectFrom('users').selectAll().where('id', '=', userId).executeTakeFirst();

  if (!user) {
    throw new NotFoundError(`User (${userId}) not found.`);
  }

  return user;
}

async function findByIds(ids: UUIDv4[]): Promise<Selectable<User>[]> {
  const users = await db.selectFrom('users').selectAll().where('id', 'in', ids).execute();

  return users;
}

export const userService = {
  findByIdOrThrow,
  findByIds,
};
