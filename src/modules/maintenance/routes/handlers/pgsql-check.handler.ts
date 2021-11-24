import { RequestHandler } from 'express';
import { ping as pingPostgresDatabase } from '@/db/knex';

interface IPgsqlCheckResponse {
  status: 'OK' | 'FAIL';
  message: string;
}
export const pgsqlCheckHandler: RequestHandler<any, IPgsqlCheckResponse, any, any> = async (req, res) => {
  try {
    await pingPostgresDatabase();
    res.send({
      status: 'OK',
      message: 'Looks good.',
    });
  } catch (err: any) {
    res.status(503).send({
      status: 'FAIL',
      message: err.message,
    });
  }
};
