import { GQL_QueryResolvers, GQL_UserConnection, GQL_UserEdge } from '@/generated/graphql';
import { userFactory } from '../../factories/user.factory';
import { getUsersUseCase } from '../../use-cases/get-users.use-case';
import { SortDirection } from '@/shared/constants';
import { UserSortField } from '../../constants/user-sort-field.enum';

export const usersResolver: GQL_QueryResolvers['users'] = async (root, args, ctx) => {
  const result = await getUsersUseCase(
    {
      before: args.before,
      after: args.after,
      first: args.first,
      sortDirection: args.sortBy?.direction ?? SortDirection.ASC,
      sortField: args.sortBy?.field ?? UserSortField.CREATED_AT,
    },
    ctx,
  );

  const userConnection: GQL_UserConnection = {
    edges: result.results.map<GQL_UserEdge>((x) => ({
      cursor: x.cursor,
      node: userFactory.createGQLUser(x.data),
    })),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  return userConnection;
};
