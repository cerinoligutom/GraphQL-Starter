import { ping as pingRedisDatabase } from '@/redis/client';
import { RequestHandler } from 'express';

interface IRedisCheckResponse {
  status: 'OK' | 'FAIL';
  message: string;
}
export const redisCheckHandler: RequestHandler<any, IRedisCheckResponse, any, any> = async (req, res) => {
  try {
    await pingRedisDatabase();
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
