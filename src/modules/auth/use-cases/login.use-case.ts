import { UserModel } from '@/db/models';
import { UnauthenticatedError } from '@/errors';
import { IContext } from '@/shared/interfaces';
import { bcryptUtil, createSchemaValidator } from '@/utils';
import * as yup from 'yup';
import Session from 'supertokens-node/recipe/session';

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
}
export async function loginUseCase(dto: ILoginDTO, ctx: IContext): Promise<ILoginUseCaseResult> {
  const { email, password } = await validateDTO(dto);

  const user = await UserModel.query().where('email', email).first();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hash);

    if (isValidPassword) {
      // IMPORTANT:
      // If you need to store session data, read more from the link below:
      // https://supertokens.io/docs/session/common-customizations/sessions/new-session#storing-session-information
      await Session.createNewSession(ctx.res, user.id.toString());

      return {
        user,
      };
    }
  }

  throw new UnauthenticatedError('Invalid username/email or password');
}
