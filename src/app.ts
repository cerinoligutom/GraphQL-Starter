import { env } from '@/config/environment';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { middleware as superTokensMiddleware, errorHandler as superTokensErrorHandler } from 'supertokens-node/framework/express';
import '@/supertokens';

import { errorMiddleware, corsMiddleware, createContextMiddleware } from '@/middlewares';
import { initApolloGraphqlServer } from '@/graphql';

import helmet from 'helmet';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import { createTerminus } from '@godaddy/terminus';

import { maintenanceRouter } from '@/modules/maintenance/routes';
import { authRouter } from '@/modules/auth/routes';
import { userRouter } from '@/modules/user/routes';
import { db } from '@/db';
import { disconnectRedisClients } from '@/redis';

const app = express();

(async () => {
  console.info(`${'='.repeat(30)}`);
  console.info(`NODE_ENV: ${env.NODE_ENV}`);
  console.info(`${'='.repeat(30)}`);

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

  const httpServer = http.createServer(app);

  await initApolloGraphqlServer(app, httpServer);

  createTerminus(httpServer, {
    async onSignal() {
      console.info('server is starting cleanup');

      return Promise.all([await db.destroy(), await disconnectRedisClients()]);
    },
  });

  httpServer.listen(env.PORT, () => {
    console.info(`Server is now up @ ${env.PORT}`);
  });
})();
