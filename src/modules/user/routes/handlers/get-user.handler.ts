import { RequestHandler } from 'express';
import { userFactory } from '../../factories/user.factory';
import { IResponseUserFull } from '../../responses/user.response';
import { getUserUseCase } from '../../use-cases/get-user.use-case';

export const getUserHandler: RequestHandler<any, IResponseUserFull, any, any> = async (req, res) => {
  const { userId } = req.params;

  const { user } = await getUserUseCase(
    {
      userId,
    },
    req.context,
  );

  res.send(userFactory.toFullResponse(user));
};
