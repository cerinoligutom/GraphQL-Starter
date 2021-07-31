import { UserModel } from '@/db/models';
import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext } from '@/shared/interfaces';
import { UniqueID } from '@/shared/types';
import { createSchemaValidator } from '@/utils';
import * as yup from 'yup';
import { userService } from '../services/user.service';

export interface IGetUserDTO {
  userId: UniqueID;
}

const schema = yup.object().shape({
  userId: UserModel.yupSchema.id,
});
const validateDTO = createSchemaValidator<IGetUserDTO>(schema);

interface IGetUserUseCaseResult {
  user: UserModel;
}
export async function getUserUseCase(dto: IGetUserDTO, ctx: IContext): Promise<IGetUserUseCaseResult> {
  await checkAuthentication(ctx);

  const { userId } = await validateDTO(dto);

  const user = await userService.findByIdOrThrow(userId);

  return {
    user,
  };
}
