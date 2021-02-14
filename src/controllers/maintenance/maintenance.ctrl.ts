import { RequestHandler } from 'express';
import { ping as pingPostgresDatabase } from '@/db/knex';
import { logger } from '@/utils';
import { pingRedisDatabase } from '@/redis/client';

const healthCheck: RequestHandler = async (req, res) => {
  const now = new Date();
  res.send({
    status: 'OK',
    serverTime: {
      utcTime: now.toUTCString(),
      localTime: now.toString(),
      ms: now.getTime(),
      iso: now.toISOString(),
    },
  });
};

const pgsqlDbCheck: RequestHandler = async (req, res) => {
  try {
    await pingPostgresDatabase();
    res.send({
      status: 'OK',
    });
  } catch (err) {
    logger.error(`${err}`);
    res.status(503).send({
      message: err.message,
    });
  }
};

const redisDbCheck: RequestHandler = async (req, res) => {
  try {
    await pingRedisDatabase();
    res.send({
      status: 'OK',
    });
  } catch (err) {
    logger.error(`${err}`);
    res.status(503).send({
      message: err.message,
    });
  }
};

export const maintenanceController = {
  healthCheck,
  pgsqlDbCheck,
  redisDbCheck,
};
