import { UserModel } from '@/db/models';
import { InternalServerError, UnauthenticatedError } from '@/errors';
import { IContext, ISessionData, ISessionJWTPayload } from '@/shared/interfaces';
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
      if (!ctx.res) {
        throw new InternalServerError('[User] Login - `res` object does not exist');
      }

      // IMPORTANT:
      // If you need to store session data, read more from the link below:
      // https://supertokens.io/docs/session/common-customizations/sessions/new-session#storing-session-information
      const session = await Session.createNewSession(ctx.res, user.id.toString());

      // We'll store the session handle in the JWT payload. When making graphql subscription requests,
      // make sure to pass this variable in the `connectionParams` of the subscription client.
      // https://github.com/apollographql/subscriptions-transport-ws#constructorurl-options-websocketimpl
      const sessionJWTPayload: ISessionJWTPayload = { sessionHandle: session.getHandle() };
      await session.updateJWTPayload(sessionJWTPayload);

      // We'll store the user id in the session data to verify authentication in the `onConnect` lifecycle event
      // of the subscription server. That way, we can confidently map that this session belongs to this user.
      const sessionData: ISessionData = { userId: user.id.toString() };
      await session.updateSessionData(sessionData);

      return {
        user,
      };
    }
  }

  throw new UnauthenticatedError('Invalid username/email or password');
}
