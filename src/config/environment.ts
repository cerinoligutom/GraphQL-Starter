import { config as configDotEnv } from 'dotenv';
configDotEnv();

interface IEnvironmentConfig {
  [key: string]: {
    environment: string;
    port: number;
    isProduction: boolean;

    db: {
      host?: string;
      user?: string;
      password?: string;
      database?: string;
      debug: boolean;
    };
  };
}

enum EnvironmentOptions {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  DEV = 'DEV',
  TEST = 'TEST',
  LOCAL = 'LOCAL',
}

const isProduction = process.env.NODE_ENV === 'production';
const DEFAULT_APP_PORT = 8080;

const ENVIRONMENT_CONFIG: IEnvironmentConfig = {
  [EnvironmentOptions.PRODUCTION]: {
    isProduction,
    environment: EnvironmentOptions.PRODUCTION,
    port: +process.env.PG_PROD_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.PG_PROD_DATABASE,
      host: process.env.PG_PROD_HOST,
      password: process.env.PG_PROD_PASSWORD,
      user: process.env.PG_PROD_USER,
      debug: false,
    },
  },

  [EnvironmentOptions.STAGING]: {
    isProduction,
    environment: EnvironmentOptions.STAGING,
    port: +process.env.PG_STAGING_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.PG_STAGING_DATABASE,
      host: process.env.PG_STAGING_HOST,
      password: process.env.PG_STAGING_PASSWORD,
      user: process.env.PG_STAGING_USER,
      debug: true,
    },
  },

  [EnvironmentOptions.DEV]: {
    isProduction,
    environment: EnvironmentOptions.DEV,
    port: +process.env.PG_DEV_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.PG_DEV_DATABASE,
      host: process.env.PG_DEV_HOST,
      password: process.env.PG_DEV_PASSWORD,
      user: process.env.PG_DEV_USER,
      debug: true,
    },
  },

  [EnvironmentOptions.TEST]: {
    isProduction: false,
    environment: EnvironmentOptions.TEST,
    port: +process.env.PG_TEST_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.PG_TEST_DATABASE,
      host: process.env.PG_TEST_HOST,
      password: process.env.PG_TEST_PASSWORD,
      user: process.env.PG_TEST_USER,
      debug: true,
    },
  },

  [EnvironmentOptions.LOCAL]: {
    isProduction: false,
    environment: EnvironmentOptions.LOCAL,
    port: +process.env.PG_LOCAL_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.PG_LOCAL_DATABASE || 'db',
      host: process.env.PG_LOCAL_HOST || 'db', // 'db' is the service name of the postgres container
      password: process.env.PG_LOCAL_PASSWORD || 'password',
      user: process.env.PG_LOCAL_USER || 'postgres',
      debug: true,
    },
  },
};

const currentEnvironment = (process.env.CURRENT_ENVIRONMENT || EnvironmentOptions.LOCAL).toLocaleUpperCase();

const VALID_ENVIRONMENTS = Object.values<string>(EnvironmentOptions);
if (!VALID_ENVIRONMENTS.includes(currentEnvironment)) {
  const formattedValidOptions = VALID_ENVIRONMENTS.map((x, i) => `${i + 1}) ${x}`).join('\n');
  console.error(`"${currentEnvironment}" is not a valid environment option. Valid environments are:\n${formattedValidOptions}`);
  throw new Error('Invalid environment.');
}

export const env = ENVIRONMENT_CONFIG[currentEnvironment];

console.info(`${'='.repeat(40)}`);
console.info(`Current Environment: ${env.environment}`);
console.info(`${'='.repeat(40)}`);
