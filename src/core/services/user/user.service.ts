import { User } from '@app/db/models';
import { UserSortField } from '@app/graphql/enums';

const getById = async (id: string) => {
  return (await User.query().findById(id)) || null;
};

const getByIds = async (ids: string[]) => {
  return await User.query().findByIds(ids);
};

interface IUserCursorPaginatedArgs {
  before?: string | null;
  after?: string | null;
  first: number;
  sortDirection: string;
  sortField: UserSortField;
}
const getCursorPaginated = async (args: IUserCursorPaginatedArgs) => {
  const { before, after, first, sortDirection, sortField } = args;

  const query = User.query()
    .orderBy(sortField, sortDirection)
    .limit(first)
    .clone();

  if (before) {
    return await User.previousCursorPage(query, before);
  }

  return await User.nextCursorPage(query, after!);
};

export const userService = {
  getById,
  getByIds,
  getCursorPaginated,
};
