import { UserModel } from '@app/db/models';
import { OrderByDirection } from 'objection';
import { ICursorPaginationResult } from '@app/core/interfaces';
import { UserSortField } from '@app/core/enums';
import { Maybe } from '@app/graphql-schema-types';

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
