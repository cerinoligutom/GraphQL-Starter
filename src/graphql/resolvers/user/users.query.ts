import { GQL_QueryResolvers } from 'graphql-resolvers';
import { UserSortField, SortDirection } from '@app/graphql/enums';

export const users: GQL_QueryResolvers['users'] = async (parent, args, { services }) => {
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

  return result;
};
