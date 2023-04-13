import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext } from '@/shared/interfaces';
import { z } from 'zod';
import { db } from '@/db';
import { Selectable } from 'kysely';
import { User } from '@/db/types';

const dtoSchema = z.object({
  offset: z.number(),
  limit: z.number().max(100),
});
export type GetUsersDTO = z.infer<typeof dtoSchema>;

type GetUsersUseCaseResult = {
  data: Selectable<User>[];
};
export async function getUsersUseCase(dto: GetUsersDTO, ctx: IContext): Promise<GetUsersUseCaseResult> {
  await checkAuthentication(ctx);

  const { offset, limit } = await dtoSchema.parse(dto);

  const users = await db.selectFrom('users').selectAll().offset(offset).limit(limit).execute();

  return {
    data: users,
  };
}
