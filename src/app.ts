import 'tsconfig-paths/register';
import { env } from '@app/config/environment';

import { errorMiddleware, httpLogger, expressStatusMonitor, corsMiddleware } from '@app/middleware';
import { ping as pingPostgresDatabase } from './db/knex';
import { initRoutes } from './routes';
import { initApolloGraphqlServer } from './graphql';

import { createServer } from 'http';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';

const app = express();

(async () => {
  // Test Postgres DB
  try {
    await pingPostgresDatabase();
  } catch {
    return;
  }

  app.use(corsMiddleware());
  app.use(express.json());
  app.use(helmet());
  app.use(compression());
  app.use(expressStatusMonitor());
  app.use(httpLogger);

  initRoutes(app);

  app.use(errorMiddleware());
  const apolloServer = initApolloGraphqlServer(app);

  // For the subscription server
  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(env.port, () => {
    console.info(`Server is now up @ ${env.port}`);
  });
})();
