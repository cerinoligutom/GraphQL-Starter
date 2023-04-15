import { env } from '@/config/environment.js';
import { asyncHandler } from '@/utils/index.js';
import express from 'express';
import { loginUseCase } from '../use-cases/login.use-case.js';
import { loginHandler } from './handlers/login.handler.js';
import { logoutHandler } from './handlers/logout.handler.js';
import { registerHandler } from './handlers/register.handler.js';

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
