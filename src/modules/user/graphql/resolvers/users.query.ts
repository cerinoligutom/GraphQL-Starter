import { GQL_QueryResolvers, GQL_UserConnection, GQL_UserEdge, SortDirection, UserSortField } from '@/generated/graphql';
import { createGQLUser } from '../../factories/user.graphql-factory';
import { getUsersUseCase } from '../../use-cases/get-users.use-case';

export const usersResolver: GQL_QueryResolvers['users'] = async (root, args, ctx) => {
  const result = await getUsersUseCase(
    {
      before: args.before,
      after: args.after,
      first: args.first,
      sortDirection: args.sortBy?.direction ?? SortDirection.ASC,
      sortField: args.sortBy?.field ?? UserSortField.CREATED_AT,
    },
    {
      req: ctx.req,
      res: ctx.res,
    },
  );

  const userConnection: GQL_UserConnection = {
    edges: result.results.map<GQL_UserEdge>((x) => ({
      cursor: x.cursor,
      node: createGQLUser(x.data),
    })),
    nodes: result.results.map((x) => createGQLUser(x.data)),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  return userConnection;
};
