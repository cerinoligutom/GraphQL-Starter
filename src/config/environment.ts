import dotenv from 'dotenv';

dotenv.config();

interface IEnvironmentConfig {
  isProduction: boolean;
  app: {
    environment: string;
    port: number;
  };

  postgresConnectionUrl: string;
  redisConnectionUrl: string;
}

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() ?? 'development';
const isProduction = NODE_ENV === 'production';

export const env: IEnvironmentConfig = {
  isProduction,
  app: {
    environment: NODE_ENV,
    port: +process.env.APP_PORT! || 8080,
  },
  postgresConnectionUrl: process.env.POSTGRES_CONNECTION_URL!,
  redisConnectionUrl: process.env.REDIS_CONNECTION_URL!,
};

// Environment defaults
if (!isProduction) {
  env.postgresConnectionUrl ||= 'postgresql://postgres:password@db:5432/db';
  env.redisConnectionUrl ||= 'redis://redis';
}

// Environment Guards
if (!env.postgresConnectionUrl) {
  throw new Error('POSTGRES_CONNECTION_URL is required');
}

if (!env.redisConnectionUrl) {
  throw new Error('REDIS_CONNECTION_URL is required');
}
