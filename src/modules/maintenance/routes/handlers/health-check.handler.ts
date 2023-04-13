import { RequestHandler } from 'express';

type HealthCheckResponse = {
  status: 'OK';
  serverTime: {
    utcTime: string;
    localTime: string;
    ms: number;
    iso: string;
  };
};
export const healthCheckHandler: RequestHandler<any, HealthCheckResponse, any, any> = async (req, res) => {
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
