import 'dotenv/config';

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

    redisUrl: string;
  };
}

enum EnvironmentOptions {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  DEV = 'DEV',
  TEST = 'TEST',
  LOCAL = 'LOCAL',
}

const DEFAULT_APP_PORT = 8080;

const currentEnvironment = (process.env.CURRENT_ENVIRONMENT || EnvironmentOptions.LOCAL).toLocaleUpperCase() as EnvironmentOptions;
const isProduction = [EnvironmentOptions.PRODUCTION, EnvironmentOptions.STAGING].includes(currentEnvironment);
process.env.NODE_ENV = isProduction ? 'production' : 'development';

const ENVIRONMENT_CONFIG: IEnvironmentConfig = {
  [EnvironmentOptions.PRODUCTION]: {
    isProduction,
    environment: EnvironmentOptions.PRODUCTION,
    port: +process.env.PROD_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.PROD_PG_DATABASE,
      host: process.env.PROD_PG_HOST,
      password: process.env.PROD_PG_PASSWORD,
      user: process.env.PROD_PG_USER,
      debug: false,
    },
    redisUrl: process.env.PROD_REDIS_URL!,
  },

  [EnvironmentOptions.STAGING]: {
    isProduction,
    environment: EnvironmentOptions.STAGING,
    port: +process.env.STAGING_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.STAGING_PG_DATABASE,
      host: process.env.STAGING_PG_HOST,
      password: process.env.STAGING_PG_PASSWORD,
      user: process.env.STAGING_PG_USER,
      debug: true,
    },

    redisUrl: process.env.STAGING_REDIS_URL!,
  },

  [EnvironmentOptions.DEV]: {
    isProduction,
    environment: EnvironmentOptions.DEV,
    port: +process.env.DEV_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.DEV_PG_DATABASE,
      host: process.env.DEV_PG_HOST,
      password: process.env.DEV_PG_PASSWORD,
      user: process.env.DEV_PG_USER,
      debug: true,
    },

    redisUrl: process.env.DEV_REDIS_URL!,
  },

  [EnvironmentOptions.TEST]: {
    isProduction: false,
    environment: EnvironmentOptions.TEST,
    port: +process.env.TEST_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.TEST_PG_DATABASE,
      host: process.env.TEST_PG_HOST,
      password: process.env.TEST_PG_PASSWORD,
      user: process.env.TEST_PG_USER,
      debug: true,
    },

    redisUrl: process.env.TEST_REDIS_URL!,
  },

  [EnvironmentOptions.LOCAL]: {
    isProduction: false,
    environment: EnvironmentOptions.LOCAL,
    port: +process.env.LOCAL_APP_PORT! || DEFAULT_APP_PORT,

    db: {
      database: process.env.LOCAL_PG_DATABASE || 'db',
      host: process.env.LOCAL_PG_HOST || 'db', // 'db' is the service name of the postgres container
      password: process.env.LOCAL_PG_PASSWORD || 'password',
      user: process.env.LOCAL_PG_USER || 'postgres',
      debug: true,
    },

    redisUrl: process.env.LOCAL_REDIS_URL || 'redis', // 'redis' is the service name of the redis container
  },
};

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
