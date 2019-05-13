import 'tsconfig-paths/register';

import { Config, MySqlConnectionConfig } from 'knex';
import { env } from '@app/config/environment';

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
};

export default config; // For application use
module.exports = config; // For CLI use
