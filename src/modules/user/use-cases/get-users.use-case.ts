import { UserModel } from '@/db/models';
import { UserSortField } from '@/graphql/enums';
import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext, ICursorPaginationArgs, ICursorPaginationResult } from '@/shared/interfaces';
import { createCursorPaginationArgsSchema } from '@/shared/yup-schema';
import { createSchemaValidator } from '@/utils';
import * as yup from 'yup';

export interface IGetUsersDTO extends ICursorPaginationArgs<UserSortField> {}

const schema = yup.object().shape({
  ...createCursorPaginationArgsSchema(UserSortField),
});
const validateDTO = createSchemaValidator<IGetUsersDTO>(schema);

export async function getUsersUseCase(dto: IGetUsersDTO, ctx: IContext): Promise<ICursorPaginationResult<UserModel>> {
  await checkAuthentication(ctx);

  const { first, after, before, sortDirection, sortField } = await validateDTO(dto);

  const query = UserModel.query().orderBy(sortField, sortDirection).limit(first);
  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}
