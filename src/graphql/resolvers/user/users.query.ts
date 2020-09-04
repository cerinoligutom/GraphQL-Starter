import { GQL_QueryResolvers, GQL_UserConnection, GQL_UserEdge } from 'graphql-resolvers';
import { UserSortField, SortDirection } from '@app/core/enums';
import { userModelToGQLObject } from '@app/core/factories/graphql';

export const usersResolver: GQL_QueryResolvers['users'] = async (root, args, { services }) => {
  const { userService } = services;

  if (!args.sortBy) {
    args.sortBy = {
      field: UserSortField.CREATED_AT,
      direction: SortDirection.ASC,
    };
  }

  const result = await userService.getCursorPaginated({
    before: args.before,
    after: args.after,
    first: args.first,
    sortDirection: args.sortBy.direction,
    sortField: args.sortBy.field,
  });

  const userConnection: GQL_UserConnection = {
    edges: result.results.map<GQL_UserEdge>((x) => ({
      cursor: x.cursor,
      node: userModelToGQLObject(x.data),
    })),
    nodes: result.results.map((x) => x.data),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  return userConnection;
};
