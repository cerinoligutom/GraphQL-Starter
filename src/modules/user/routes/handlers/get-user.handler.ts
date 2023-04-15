import { RequestHandler } from 'express';
import { userFactory } from '../../factories/user.factory.js';
import { ResponseUserFull } from '../../responses/user.response.js';
import { getUserUseCase } from '../../use-cases/get-user.use-case.js';

export const getUserHandler: RequestHandler<any, ResponseUserFull, any, any> = async (req, res) => {
  const { userId } = req.params;

  const { user } = await getUserUseCase(
    {
      userId,
    },
    req.context,
  );

  res.send(userFactory.toFullResponse(user));
};
