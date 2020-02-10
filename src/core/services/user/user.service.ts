import { User } from '@app/db/models';
import { UserSortField } from '@app/graphql/enums';
import { OrderByDirection } from 'objection';

async function getById(id: string) {
  return (await User.query().findById(id)) || null;
}

async function getByIds(ids: string[]) {
  return await User.query().findByIds(ids);
}

interface IUserCursorPaginatedArgs {
  before?: string | null;
  after?: string | null;
  first: number;
  sortDirection: OrderByDirection;
  sortField: UserSortField;
}
async function getCursorPaginated(args: IUserCursorPaginatedArgs) {
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
