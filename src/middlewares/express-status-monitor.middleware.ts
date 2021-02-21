import { env } from '@/config/environment';
import { RequestHandler } from 'express';

const expressStatusMonitor = require('express-status-monitor');

// https://www.npmjs.com/package/express-status-monitor#health-checks
interface IHealthCheckItem {
  protocol: string;
  host: string;
  path: string;
  port: string;
}

const commonHealthCheckItemArgs: Partial<IHealthCheckItem> = {
  protocol: 'http',
  host: 'localhost',
  port: `${env.app.port}`,
};

// eslint-disable-next-line arrow-body-style
export const expressStatusMonitorMiddleware = (): RequestHandler => {
  return expressStatusMonitor({
    title: 'API Status',
    healthChecks: [
      {
        ...commonHealthCheckItemArgs,
        path: '/api/v1/maintenance/pgsql-check',
      },
      {
        ...commonHealthCheckItemArgs,
        path: '/api/v1/maintenance/redis-check',
      },
    ] as IHealthCheckItem[],
  });
};
