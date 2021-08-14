import { userFactory } from '@/modules/user/factories/user.factory';
import { IResponseUserFull } from '@/modules/user/responses/user.response';
import { RequestHandler } from 'express';
import { loginUseCase } from '../../use-cases/login.use-case';

interface ILoginResponse {
  user: IResponseUserFull;
}
export const loginHandler: RequestHandler<any, ILoginResponse, any, any> = async (req, res) => {
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
