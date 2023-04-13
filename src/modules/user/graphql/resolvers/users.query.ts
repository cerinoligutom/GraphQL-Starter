import { GQL_QueryResolvers } from '@/generated/graphql';
import { userFactory } from '../../factories/user.factory';
import { getUsersUseCase } from '../../use-cases/get-users.use-case';

export const usersResolver: GQL_QueryResolvers['users'] = async (root, args, ctx) => {
  const result = await getUsersUseCase(
    {
      offset: args.offset ?? 0,
      limit: args.limit ?? 10,
    },
    ctx,
  );

  return result.data.map((user) => userFactory.createGQLUser(user));
};
