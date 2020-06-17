import { env } from '@app/config/environment';

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

export const expressStatusMonitor = () => {
  return require('express-status-monitor')({
    title: 'API Status',
    healthChecks: [
      {
        ...commonHealthCheckItemArgs,
        path: '/api/v1/maintenance/pgsql-check',
      },
    ] as IHealthCheckItem[],
  });
};
