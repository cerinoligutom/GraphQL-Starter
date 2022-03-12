import { env } from '@/config/environment';
import { asyncHandler } from '@/utils';
import express from 'express';
import { loginUseCase } from '../use-cases/login.use-case';
import { loginHandler } from './handlers/login.handler';
import { logoutHandler } from './handlers/logout.handler';
import { registerHandler } from './handlers/register.handler';

const router = express.Router();

router.post('/api/v1/auth/login', asyncHandler(loginHandler));
router.post('/api/v1/auth/logout', asyncHandler(logoutHandler));
router.post('/api/v1/auth/register', asyncHandler(registerHandler));

if (!env.isProduction) {
  router.get('/api/v1/auth/logout', asyncHandler(logoutHandler));

  router.get(
    '/api/v1/auth/login/superadmin',
    asyncHandler(async (req, res) => {
      await loginUseCase(
        {
          email: 'superadmin@app.com',
          password: 'password',
        },
        req.context,
      );
      res.send('superadmin logged in');
    }),
  );
}

export const authRouter = router;
