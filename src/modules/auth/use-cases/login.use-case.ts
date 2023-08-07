import { InternalServerError, UnauthenticatedError } from '@/errors/index.js';
import { IContext } from '@/shared/interfaces/index.js';
import { bcryptUtil, createSchemaValidator } from '@/utils/index.js';
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
const validateDTO = createSchemaValidator(dtoSchema);
export type LoginDTO = z.infer<typeof dtoSchema>;

type LoginUseCaseResult = {
  user: Selectable<User>;
};
export async function loginUseCase(dto: LoginDTO, ctx: IContext): Promise<LoginUseCaseResult> {
  const { email, password } = await validateDTO(dto);

  const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hashedPassword);

    if (isValidPassword) {
      if (!ctx.res || !ctx.req) {
        throw new InternalServerError('[User] Login - `req` or `res` object does not exist');
      }

      // IMPORTANT:
      // If you need to store session data, read more from the link below:
      // https://supertokens.io/docs/session/common-customizations/sessions/new-session#storing-session-information
      await Session.createNewSession(ctx.req, ctx.res, 'public', user.id);

      // When making graphql subscription requests, make sure to pass the sessionHandle in the `connectionParams` of the subscription client.
      // https://github.com/apollographql/subscriptions-transport-ws#constructorurl-options-websocketimpl
      // You can get the sessionHandle from the frontend (with the Vanilla JS SDK) by invoking this method:
      // https://supertokens.com/docs/web-js/modules/recipe_session.html#getAccessTokenPayloadSecurely-1
      // Something like `(await Session.getAccessTokenPayloadSecurely()).sessionHandle` should work.

      return {
        user,
      };
    }
  }

  throw new UnauthenticatedError('Invalid username/email or password');
}
