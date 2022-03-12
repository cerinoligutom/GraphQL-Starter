import { env } from '@/config/environment';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { middleware as superTokensMiddleware, errorHandler as superTokensErrorHandler } from 'supertokens-node/framework/express';
import '@/supertokens';

import { errorMiddleware, corsMiddleware, createContextMiddleware } from '@/middlewares';
import { ping as pingPostgresDatabase } from '@/db/knex';
import { ping as pingRedisDatabase } from '@/redis/client';
import { initApolloGraphqlServer } from '@/graphql';

import helmet from 'helmet';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

import { maintenanceRouter } from '@/modules/maintenance/routes';
import { authRouter } from '@/modules/auth/routes';
import { userRouter } from '@/modules/user/routes';

const app = express();

(async () => {
  console.info(`${'='.repeat(30)}`);
  console.info(`NODE_ENV: ${env.app.environment}`);
  console.info(`${'='.repeat(30)}`);

  // Test Postgres DB
  try {
    await pingPostgresDatabase();
  } catch {
    return;
  }

  // Test Redis DB
  try {
    await pingRedisDatabase();
  } catch {
    return;
  }

  // IMPORTANT:
  // In case your app is running behind a proxy, you should configure this.
  // Elastic Beanstalk instances for example has an nginx proxy by default.
  // Read more at https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true);

  // https://github.com/graphql/graphql-playground/issues/1283#issuecomment-1012913186
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(corsMiddleware());
  app.use(superTokensMiddleware());

  app.use(['/api', '/graphql'], verifySession({ sessionRequired: false }));
  app.use(createContextMiddleware());

  const routers: Router[] = [
    // IMPORTANT: Add app routers here
    maintenanceRouter,
    authRouter,
    userRouter,
  ];
  app.use(routers);

  app.use(superTokensErrorHandler());
  app.use(errorMiddleware());

  const httpServer = app.listen(env.app.port, () => {
    console.info(`Server is now up @ ${env.app.port}`);
  });

  await initApolloGraphqlServer(app, httpServer);
})();
