import { UserModel } from '@/db/models';
import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext, ICursorPaginationArgs, ICursorPaginationResult } from '@/shared/interfaces';
import { createCursorPaginationArgsSchema } from '@/shared/yup-schema';
import { createSchemaValidator } from '@/utils';
import * as yup from 'yup';
import { UserSortField } from '../constants/user-sort-field.enum';

export interface IGetUsersDTO extends ICursorPaginationArgs<UserSortField> {}

const schema = yup.object().shape({
  ...createCursorPaginationArgsSchema(UserSortField),
});
const validateDTO = createSchemaValidator<IGetUsersDTO>(schema);

interface IGetUsersUseCaseResult extends ICursorPaginationResult<UserModel> {}
export async function getUsersUseCase(dto: IGetUsersDTO, ctx: IContext): Promise<IGetUsersUseCaseResult> {
  await checkAuthentication(ctx);

  const { first, after, before, sortDirection, sortField } = await validateDTO(dto);

  const query = UserModel.query().orderBy(sortField, sortDirection).limit(first);
  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}
