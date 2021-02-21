import { UserModel } from '@/db/models';
import { UnauthenticatedError } from '@/errors';
import { IContext } from '@/shared/interfaces';
import { bcryptUtil, createSchemaValidator } from '@/utils';
import * as yup from 'yup';
import { createAccessToken } from '../helpers/create-access-token';

export interface ILoginDTO {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: UserModel.yupSchema.email,
  password: UserModel.yupSchema.password,
});
const validateDTO = createSchemaValidator<ILoginDTO>(schema);

interface ILoginUseCaseResult {
  user: UserModel;
  token: string;
}
export async function loginUseCase(dto: ILoginDTO, ctx: IContext): Promise<ILoginUseCaseResult> {
  const { email, password } = await validateDTO(dto);

  const user = await UserModel.query().where('email', email).first();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hash, user.salt);

    if (isValidPassword) {
      const token = createAccessToken({ userId: user.id });

      return {
        user,
        token,
      };
    }
  }

  throw new UnauthenticatedError('Invalid username/email or password');
}
