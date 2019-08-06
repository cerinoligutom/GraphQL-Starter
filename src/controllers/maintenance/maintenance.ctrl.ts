import { RequestHandler } from 'express';
import { ping as pingPostgresDatabase } from '../../db/knex';

const healthCheck: RequestHandler = async (req, res) => {
  // tslint:disable-next-line: no-any
  let postgresStatus: any;
  await pingPostgresDatabase()
    .then(() => {
      postgresStatus = 'OK';
    })
    .catch(err => {
      postgresStatus = err;
    });

  const now = new Date();

  res.send({
    status: 'OK',
    serverTime: {
      utcTime: now.toUTCString(),
      localTime: now.toString(),
      ms: now.getTime(),
      iso: now.toISOString(),
    },
    postgres: postgresStatus,
  });
};

export const maintenanceController = {
  healthCheck,
};
