import { Config } from 'knex';
import { env } from './src/config/environment';

const config: Config = {
  client: 'pg',
  connection: env.postgresConnectionUrl,
  useNullAsDefault: true,
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },

  // Modify this if you want to see the actual SQL queries executed thru knex
  debug: false,
};

export default config; // For application use
module.exports = config; // For CLI use
