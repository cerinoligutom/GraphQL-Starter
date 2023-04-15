import type { Selectable } from 'kysely';
import type { User } from '@/db/types.js';
import { db } from '@/db/index.js';
import { NotFoundError } from '@/errors/index.js';

async function findByIdOrThrow(userId: string): Promise<Selectable<User>> {
  const user = await db.selectFrom('users').selectAll().where('id', '=', userId).executeTakeFirst();

  if (!user) {
    throw new NotFoundError(`User (${userId}) not found.`);
  }

  return user;
}

async function findByIds(ids: string[]): Promise<Selectable<User>[]> {
  const users = await db.selectFrom('users').selectAll().where('id', 'in', ids).execute();

  return users;
}

export const userService = {
  findByIdOrThrow,
  findByIds,
};
