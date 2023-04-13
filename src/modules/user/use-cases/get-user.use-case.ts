import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext } from '@/shared/interfaces';
import { z } from 'zod';
import { userService } from '../services/user.service';
import { Selectable } from 'kysely';
import { User } from '@/db/types';
import { UserSchema } from '@/db/schema';

const dtoSchema = z.object({
  userId: UserSchema.shape.id,
});
type GetUserDTO = z.infer<typeof dtoSchema>;

type GetUserUseCaseResult = {
  user: Selectable<User>;
};
export async function getUserUseCase(dto: GetUserDTO, ctx: IContext): Promise<GetUserUseCaseResult> {
  await checkAuthentication(ctx);

  const { userId } = await dtoSchema.parse(dto);

  const user = await userService.findByIdOrThrow(userId);

  return {
    user,
  };
}
