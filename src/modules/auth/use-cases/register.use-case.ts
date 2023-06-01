import { db } from '@/db/index.js';
import { UserSchema } from '@/db/schema/index.js';
import { User } from '@/db/types.js';
import { BadInputError, InternalServerError } from '@/errors/index.js';
import { IContext } from '@/shared/interfaces/index.js';
import { bcryptUtil, createSchemaValidator } from '@/utils/index.js';
import { Selectable } from 'kysely';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const dtoSchema = z.object({
  firstName: UserSchema.shape.firstName,
  middleName: UserSchema.shape.middleName,
  lastName: UserSchema.shape.lastName,
  email: UserSchema.shape.email,
  password: UserSchema.shape.password,
});
const validateDTO = createSchemaValidator(dtoSchema);
type RegisterDTO = z.infer<typeof dtoSchema>;

type RegisterUseCaseResult = {
  user: Selectable<User>;
};
export async function registerUseCase(dto: RegisterDTO, ctx: IContext): Promise<RegisterUseCaseResult> {
  const { firstName, middleName, lastName, email, password } = await validateDTO(dto);

  const hash = await bcryptUtil.generateHash(password);

  const existingEmail = await db.selectFrom('users').select('email').where('email', '=', email).executeTakeFirst();
  if (existingEmail) {
    throw new BadInputError({ email: ['Email already taken'] });
  }

  const user = await db
    .insertInto('users')
    .values({
      id: uuidv4(),
      firstName,
      middleName,
      lastName,
      email,
      hashedPassword: hash,
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    throw new InternalServerError('Failed to create user');
  }

  return { user };
}
