import 'tsconfig-paths/register';

import { Config, MySqlConnectionConfig } from 'knex';
import { env } from '@app/config/environment';

import { types } from 'pg';
// Note:
// In this setup, I'd like my dates fetched as strings instead of date instances.
// '1184' is the oid for type 'timestamptz'. See https://github.com/brianc/node-pg-types how to get list of oid.
types.setTypeParser(1184, v => v);

const connectionConfig: MySqlConnectionConfig = {
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  debug: env.db.debug,
};

const config: Config = {
  client: 'pg',
  connection: connectionConfig,
  useNullAsDefault: true,
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
  debug: env.db.debug,
};

export default config; // For application use
module.exports = config; // For CLI use
