import { InternalServerError, UnauthenticatedError } from '@/errors/index.js';
import { IContext, IAccessTokenPayload } from '@/shared/interfaces/index.js';
import { bcryptUtil } from '@/utils/index.js';
import { z } from 'zod';
import Session from 'supertokens-node/recipe/session/index.js';
import { UserSchema } from '@/db/schema/index.js';
import { db } from '@/db/index.js';
import { Selectable } from 'kysely';
import { User } from '@/db/types.js';

const dtoSchema = z.object({
  email: UserSchema.shape.email,
  password: UserSchema.shape.password,
});
export type LoginDTO = z.infer<typeof dtoSchema>;

type LoginUseCaseResult = {
  user: Selectable<User>;
};
export async function loginUseCase(dto: LoginDTO, ctx: IContext): Promise<LoginUseCaseResult> {
  const { email, password } = await dtoSchema.parse(dto);

  const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hashedPassword);

    if (isValidPassword) {
      if (!ctx.res || !ctx.req) {
        throw new InternalServerError('[User] Login - `req` or `res` object does not exist');
      }

      // As of v13, this needs to be set. The Frontend SDK will automatically set this by default.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.req!.headers['st-auth-mode'] = 'cookie';

      // IMPORTANT:
      // If you need to store session data, read more from the link below:
      // https://supertokens.io/docs/session/common-customizations/sessions/new-session#storing-session-information
      const session = await Session.createNewSession(ctx.req, ctx.res, user.id);

      // We'll store the session handle in the Access Token payload. When making graphql subscription requests,
      // make sure to pass this variable in the `connectionParams` of the subscription client.
      // https://github.com/apollographql/subscriptions-transport-ws#constructorurl-options-websocketimpl
      const accessTokenPayload: IAccessTokenPayload = { sessionHandle: session.getHandle() };
      await session.mergeIntoAccessTokenPayload(accessTokenPayload);

      return {
        user,
      };
    }
  }

  throw new UnauthenticatedError('Invalid username/email or password');
}
