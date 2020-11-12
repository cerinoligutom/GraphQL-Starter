import { GQL_QueryResolvers, GQL_UserConnection, GQL_UserEdge } from '@app/graphql-schema-types';
import { UserSortField, SortDirection } from '@app/core/enums';
import { createGQL_User } from '@app/core/factories/graphql';

export const usersResolver: GQL_QueryResolvers['users'] = async (root, args, { services }) => {
  const { userService } = services;

  const result = await userService.getCursorPaginated({
    before: args.before,
    after: args.after,
    first: args.first,
    sortDirection: args.sortBy?.direction ?? SortDirection.ASC,
    sortField: args.sortBy?.field ?? UserSortField.CREATED_AT,
  });

  const userConnection: GQL_UserConnection = {
    edges: result.results.map<GQL_UserEdge>((x) => ({
      cursor: x.cursor,
      node: createGQL_User(x.data),
    })),
    nodes: result.results.map((x) => createGQL_User(x.data)),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  return userConnection;
};
