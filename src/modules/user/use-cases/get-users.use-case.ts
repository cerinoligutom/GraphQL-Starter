import { UserModel } from '@/db/models';
import { Maybe } from '@/generated/graphql';
import { SortDirection, UserSortField } from '@/graphql/enums';
import { checkAuthentication } from '@/modules/auth/helpers/check-authenticated';
import { IContext, ICursorPaginationResult } from '@/shared/interfaces';
import { cursorArgsSchema } from '@/shared/yup-schema';
import { createSchemaValidator } from '@/utils';
import * as yup from 'yup';

export interface IGetUsersDTO {
  first: number;
  before?: Maybe<string>;
  after?: Maybe<string>;
  sortDirection: SortDirection;
  sortField: UserSortField;
}

const schema = yup.object().shape({
  ...cursorArgsSchema,
  sortDirection: yup.string().oneOf(Object.values(SortDirection)).required(),
  sortField: yup.string().oneOf(Object.values(UserSortField)).required(),
});
const validateDTO = createSchemaValidator<IGetUsersDTO>(schema);

export async function getUsersUseCase(dto: IGetUsersDTO, ctx: IContext): Promise<ICursorPaginationResult<UserModel>> {
  checkAuthentication(ctx);

  const { first, after, before, sortDirection, sortField } = await validateDTO(dto);

  const query = UserModel.query().orderBy(sortField, sortDirection).limit(first);
  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}
