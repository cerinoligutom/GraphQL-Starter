import { Express } from 'express';

import { routes as v1Routes } from './v1';

export const initRoutes = (app: Express) => {
  app.use('/api/v1', v1Routes);
};
