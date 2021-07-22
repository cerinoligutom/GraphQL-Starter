import { env } from '@/config/environment';

import SuperTokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import '@/supertokens';

import { errorMiddleware, corsMiddleware } from '@/middlewares';
import { ping as pingPostgresDatabase } from '@/db/knex';
import { ping as pingRedisDatabase } from '@/redis/client';
import { initApolloGraphqlServer } from '@/graphql';

import { createServer } from 'http';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';

import { userRouter } from '@/modules/user/routes';
import { maintenanceRouter } from '@/modules/maintenance/routes';
import { authRouter } from '@/modules/auth/routes';

const app = express();

(async () => {
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

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(corsMiddleware());
  app.use(SuperTokens.middleware());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.use(['/api', '/graphql'], Session.verifySession({ sessionRequired: false }));

  // IMPORTANT: Add app routers here
  app.use([maintenanceRouter, authRouter, userRouter]);

  app.use(SuperTokens.errorHandler());
  app.use(errorMiddleware());

  // For the subscription server. Read more from the link below:
  // https://www.apollographql.com/docs/apollo-server/migration/#subscriptions
  const httpServer = createServer(app);

  await initApolloGraphqlServer(app, httpServer);

  httpServer.listen(env.app.port, () => {
    console.info(`Server is now up @ ${env.app.port}`);
  });
})();
