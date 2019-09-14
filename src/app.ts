import 'tsconfig-paths/register';

import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import { env } from '@app/config/environment';

import { errorMiddleware, httpLogger } from '@app/middleware';

import { ping as pingPostgresDatabase } from './db/knex';

import express from 'express';
import { initRoutes } from './routes';
import { initApolloGraphqlServer } from './graphql';

const app = express();

const startApp = async () => {
  // Test Postgres DB
  try {
    await pingPostgresDatabase();
  } catch {
    return;
  }

  app.use(require('express-status-monitor')());
  app.use(httpLogger);
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  initRoutes(app);

  initApolloGraphqlServer(app);

  app.use(errorMiddleware());

  app.listen(env.port, () => {
    console.info(`Server is now up @ ${env.port}`);
  });
};
startApp();
