import { Express } from 'express';

import { routes as v1Routes } from './v1';
import { initRefreshTokenRoute } from './refresh-token.route';

export const initRoutes = (app: Express) => {
  initRefreshTokenRoute(app);

  app.use('/api/v1', v1Routes);
};
