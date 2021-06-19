import { GQL_UserConnection, GQL_UserEdge } from '@/generated/graphql';
import { SortDirection } from '@/shared/constants';
import { RequestHandler } from 'express';
import { UserSortField } from '../../constants/user-sort-field.enum';
import { userFactory } from '../../factories/user.factory';
import { getUsersUseCase } from '../../use-cases/get-users.use-case';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGetUsersResponse extends GQL_UserConnection {}
export const getUsersHandler: RequestHandler<any, IGetUsersResponse, any, any> = async (req, res) => {
  const { before, after, first, sortDirection, sortField } = req.query;

  const result = await getUsersUseCase(
    {
      before,
      after,
      first,
      sortDirection: sortDirection ?? SortDirection.ASC,
      sortField: sortField ?? UserSortField.CREATED_AT,
    },
    {
      req,
      res,
    },
  );

  // IMPORTANT:
  // Your return here doesn't necessarily have to be the same as your GraphQL API.
  // Adjust to your needs. For demo purposes, I just reused the graphql factories here.
  res.send({
    edges: result.results.map<GQL_UserEdge>((x) => ({
      cursor: x.cursor,
      node: userFactory.createGQLUser(x.data),
    })),
    nodes: result.results.map((x) => userFactory.createGQLUser(x.data)),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  });
};
