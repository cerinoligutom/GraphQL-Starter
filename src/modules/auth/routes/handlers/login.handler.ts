import { userFactory } from '@/modules/user/factories/user.factory';
import { ResponseUserFull } from '@/modules/user/responses/user.response';
import { RequestHandler } from 'express';
import { loginUseCase } from '../../use-cases/login.use-case';

type ResponseBody = {
  user: ResponseUserFull;
};
export const loginHandler: RequestHandler<any, ResponseBody, any, any> = async (req, res) => {
  const { email, password } = req.body as any;

  const { user } = await loginUseCase(
    {
      email,
      password,
    },
    req.context,
  );

  res.send({
    user: userFactory.toFullResponse(user),
  });
};
