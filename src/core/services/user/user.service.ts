import { User } from '@app/db/models';
import { UserSortField } from '@app/graphql/enums';
import { OrderByDirection } from 'objection';
import { ICursorPaginationResult } from '@app/core/interfaces';

async function getById(id: string): Promise<User> {
  return User.query().findById(id);
}

async function getByIds(ids: string[]): Promise<User[]> {
  return User.query().findByIds(ids);
}

interface IUserCursorPaginatedArgs {
  before?: string | null;
  after?: string | null;
  first: number;
  sortDirection: OrderByDirection;
  sortField: UserSortField;
}
async function getCursorPaginated(args: IUserCursorPaginatedArgs): Promise<ICursorPaginationResult<User>> {
  const { before, after, first, sortDirection, sortField } = args;

  const query = User.query()
    .orderBy(sortField, sortDirection)
    .limit(first);

  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}

export const userService = {
  getById,
  getByIds,
  getCursorPaginated,
};
