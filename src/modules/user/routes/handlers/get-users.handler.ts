import { GQL_UserConnection, GQL_UserEdge } from '@/generated/graphql';
import { SortDirection } from '@/shared/enums';
import { RequestHandler } from 'express';
import { UserSortField } from '../../enums/user-sort-field.enum';
import { createGQLUser } from '../../factories/user.graphql-factory';
import { getUsersUseCase } from '../../use-cases/get-users.use-case';

export const getUsersHandler: RequestHandler = async (req, res) => {
  const { before, after, first, sortDirection, sortField } = req.query as any;

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
      userId: req.userId,
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

  res.send(userConnection);
};
