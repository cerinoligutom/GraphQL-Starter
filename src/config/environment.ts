interface IEnvironmentConfig {
  [key: string]: {
    environment: string;
    host: string;
    port: number;
    isProduction: boolean;

    db: {
      host: string | undefined;
      user: string | undefined;
      password: string | undefined;
      database: string | undefined;
      debug: boolean;
    };
  };
}

const isProduction = process.env.NODE_ENV === 'production';

const ENVIRONMENT_CONFIG: IEnvironmentConfig = {
  PRODUCTION: {
    isProduction,
    environment: 'PRODUCTION',
    host: '0.0.0.0',
    port: 9200,

    db: {
      database: process.env.PG_PROD_DATABASE,
      host: process.env.PG_PROD_HOST,
      password: process.env.PG_PROD_PASSWORD,
      user: process.env.PG_PROD_USER,
      debug: false,
    },
  },

  STAGING: {
    isProduction,
    environment: 'STAGING',
    host: '0.0.0.0',
    port: 9200,

    db: {
      database: process.env.PG_STAGING_DATABASE,
      host: process.env.PG_STAGING_HOST,
      password: process.env.PG_STAGING_PASSWORD,
      user: process.env.PG_STAGING_USER,
      debug: true,
    },
  },

  TEST: {
    isProduction: false,
    environment: 'TEST',
    host: '0.0.0.0',
    port: 9200,

    db: {
      database: process.env.PG_TEST_DATABASE,
      host: process.env.PG_TEST_HOST,
      password: process.env.PG_TEST_PASSWORD,
      user: process.env.PG_TEST_USER,
      debug: true,
    },
  },

  LOCAL: {
    isProduction: false,
    environment: 'LOCAL',
    host: '0.0.0.0',
    port: 9200,

    db: {
      database: process.env.PG_LOCAL_DATABASE || 'app',
      host: process.env.PG_LOCAL_HOST || 'db', // 'db' is the service name of the postgres container
      password: process.env.PG_LOCAL_PASSWORD || 'password',
      user: process.env.PG_LOCAL_USER || 'postgres',
      debug: true,
    },
  },
};

enum EnvironmentOptions {
  Production = 'PRODUCTION',
  Staging = 'STAGING',
  Test = 'TEST',
  Local = 'LOCAL',
}

const currentEnvironment = process.env.CURRENT_ENVIRONMENT || EnvironmentOptions.Local;

export const env = ENVIRONMENT_CONFIG[currentEnvironment];
