import { UserModel } from '@/db/models';
import { OrderByDirection } from 'objection';
import { ICursorPaginationResult } from '@/core/interfaces';
import { UserSortField } from '@/core/enums';
import { Maybe } from '@/generated/graphql';

async function getById(id: string): Promise<UserModel> {
  return UserModel.query().findById(id);
}

async function getByIds(ids: string[]): Promise<UserModel[]> {
  return UserModel.query().findByIds(ids);
}

interface IUserCursorPaginatedArgs {
  before?: Maybe<string>;
  after?: Maybe<string>;
  first: number;
  sortDirection: OrderByDirection;
  sortField: UserSortField;
}
async function getCursorPaginated(args: IUserCursorPaginatedArgs): Promise<ICursorPaginationResult<UserModel>> {
  const { before, after, first, sortDirection, sortField } = args;

  const query = UserModel.query().orderBy(sortField, sortDirection).limit(first);

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
