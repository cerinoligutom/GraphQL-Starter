import { User } from '@app/db/models';
import { UserSortField } from '@app/graphql/enums';

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
  sortDirection: string;
  sortField: UserSortField;
}
async function getCursorPaginated(args: IUserCursorPaginatedArgs) {
  const { before, after, first, sortDirection, sortField } = args;

  const query = User.query()
    .orderBy(sortField, sortDirection)
    .limit(first)
    .clone();

  if (before) {
    return await User.previousCursorPage(query, before);
  }

  return await User.nextCursorPage(query, after!);
}

export const userService = {
  getById,
  getByIds,
  getCursorPaginated,
};
