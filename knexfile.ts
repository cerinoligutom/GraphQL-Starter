import 'tsconfig-paths/register';
import { Config } from 'knex';
import { env } from '@/config/environment';

const config: Config = {
  client: 'pg',
  connection: env.postgresConnectionUrl,
  useNullAsDefault: true,
  migrations: {
    directory: './src/db/migrations',
    loadExtensions: ['.js', '.ts'],
  },
  seeds: {
    directory: './src/db/seeds',
  },

  // Modify this if you want to see the actual SQL queries executed thru knex
  debug: false,
};

export default config;
