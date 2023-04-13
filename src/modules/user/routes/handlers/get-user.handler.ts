import { RequestHandler } from 'express';
import { userFactory } from '../../factories/user.factory';
import { ResponseUserFull } from '../../responses/user.response';
import { getUserUseCase } from '../../use-cases/get-user.use-case';

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
