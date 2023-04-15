import { RequestHandler } from 'express';
import { userFactory } from '../../factories/user.factory.js';
import { ResponseUserFull } from '../../responses/user.response.js';
import { getUsersUseCase } from '../../use-cases/get-users.use-case.js';

type ResponseBody = {
  data: ResponseUserFull[];
};

export const getUsersHandler: RequestHandler<any, ResponseBody, any, any> = async (req, res) => {
  const { offset, limit } = req.query;

  const result = await getUsersUseCase(
    {
      offset,
      limit,
    },
    req.context,
  );

  // IMPORTANT:
  // Your return here doesn't necessarily have to be the same as your GraphQL API.
  // Think about how you want to design and handle your responses.
  res.send({
    data: result.data.map((user) => userFactory.toFullResponse(user)),
  });
};
