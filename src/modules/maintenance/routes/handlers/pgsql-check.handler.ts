import { RequestHandler } from 'express';
import { ping as pingPostgresDatabase } from '@/db/knex';

export const pgsqlCheckHandler: RequestHandler = async (req, res) => {
  try {
    await pingPostgresDatabase();
    res.send({
      status: 'OK',
    });
  } catch (err) {
    res.status(503).send({
      message: err.message,
    });
  }
};
