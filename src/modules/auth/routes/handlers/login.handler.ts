import { RequestHandler } from 'express';
import { loginUseCase } from '../../use-cases/login.use-case';

export const loginHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body as any;

  const { user, token } = await loginUseCase(
    {
      email,
      password,
    },
    { req, res },
  );

  res.send({
    user,
    token,
  });
};
