/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spaced-comment */
import dotenv from 'dotenv';

enum Environment {
  PRODUCTION = 'production',
  STAGING = 'staging',
  TEST = 'test',
  DEVELOPMENT = 'development',
}

//////////////////////////////////////////////////////////////////////////////

// NOTE: Modify this variable to switch environments during local development
const CURRENT_ENVIRONMENT = Environment.DEVELOPMENT;

//////////////////////////////////////////////////////////////////////////////

function initEnvironment(currentEnvironment: Environment) {
  // tslint:disable-next-line: no-shadowed-variable
  let isProduction = false;

  // Load dotenv based on app environment
  dotenv.config({
    path: `.env.${currentEnvironment}`,
  });

  const appEnvironment = (process.env.NODE_ENV ?? currentEnvironment) as Environment;

  // Set NODE_ENV to "production" for production-like environments
  switch (appEnvironment) {
    case Environment.PRODUCTION:
    case Environment.STAGING:
      process.env.NODE_ENV = 'production';
      isProduction = true;
      break;
    default:
      process.env.NODE_ENV = 'development';
  }

  return {
    isProduction,
    APP_ENV: currentEnvironment,
  };
}

const { APP_ENV, isProduction } = initEnvironment(CURRENT_ENVIRONMENT);

//////////////////////////////////////////////////////////////////////////////

interface IEnvironmentConfig {
  isProduction: boolean;
  app: {
    environment: string;
    port: number;
  };

  postgresConnectionUrl?: string;
  redisConnectionUrl?: string;
}

export const env: IEnvironmentConfig = {
  isProduction,
  app: {
    environment: APP_ENV,
    port: +process.env.APP_PORT! || 8080,
  },
  postgresConnectionUrl: process.env.POSTGRES_CONNECTION_URL,
  redisConnectionUrl: process.env.REDIS_CONNECTION_URL,
};

// Development environment defaults
if (APP_ENV === Environment.DEVELOPMENT) {
  env.postgresConnectionUrl = env.postgresConnectionUrl ?? 'postgresql://postgres:password@db:5432/db';
  env.redisConnectionUrl = env.redisConnectionUrl ?? 'redis://redis';
}

console.info(`${'='.repeat(40)}`);
console.info(`Current Environment: ${env.app.environment}`);
console.info(`${'='.repeat(40)}`);
