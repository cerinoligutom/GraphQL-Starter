import { SortDirection } from '@/shared/constants';
import { IResponsePaginated } from '@/shared/interfaces';
import { RequestHandler } from 'express';
import { UserSortField } from '../../constants/user-sort-field.enum';
import { userFactory } from '../../factories/user.factory';
import { IResponseUserFull } from '../../responses/user.response';
import { getUsersUseCase } from '../../use-cases/get-users.use-case';

export const getUsersHandler: RequestHandler<any, IResponsePaginated<IResponseUserFull>, any, any> = async (req, res) => {
  const { before, after, first, sortDirection, sortField } = req.query;

  const result = await getUsersUseCase(
    {
      before,
      after,
      first,
      sortDirection: sortDirection ?? SortDirection.ASC,
      sortField: sortField ?? UserSortField.CREATED_AT,
    },
    req.context,
  );

  // IMPORTANT:
  // Your return here doesn't necessarily have to be the same as your GraphQL API.
  // Think about how you want to design and handle your responses.
  res.send({
    data: result.results.map((x) => userFactory.toFullResponse(x.data)),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
    remaining: result.remaining,
  });
};
