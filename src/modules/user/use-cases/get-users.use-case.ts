import { checkAuthentication } from '@/modules/auth/helpers/check-authentication.js';
import { IContext } from '@/shared/interfaces/index.js';
import { z } from 'zod';
import { db } from '@/db/index.js';
import { Selectable } from 'kysely';
import type { User } from '@/db/types.js';
import { createSchemaValidator } from '@/utils/index.js';

const dtoSchema = z.object({
  offset: z.number(),
  limit: z.number().max(100),
});
const validateDTO = createSchemaValidator(dtoSchema);
export type GetUsersDTO = z.infer<typeof dtoSchema>;

type GetUsersUseCaseResult = {
  data: Selectable<User>[];
};
export async function getUsersUseCase(dto: GetUsersDTO, ctx: IContext): Promise<GetUsersUseCaseResult> {
  await checkAuthentication(ctx);

  const { offset, limit } = await validateDTO(dto);

  const users = await db.selectFrom('users').selectAll().offset(offset).limit(limit).execute();

  return {
    data: users,
  };
}
