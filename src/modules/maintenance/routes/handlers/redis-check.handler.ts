import { ping as pingRedisDatabase } from '@/redis/client';
import { RequestHandler } from 'express';

export const redisCheckHandler: RequestHandler = async (req, res) => {
  try {
    await pingRedisDatabase();
    res.send({
      status: 'OK',
    });
  } catch (err) {
    res.status(503).send({
      message: err.message,
    });
  }
};
