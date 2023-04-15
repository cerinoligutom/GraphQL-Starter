import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from './types.js';
import { env } from '@/config/environment.js';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    // You might have a more advanced config for your project.
    // Set the pool accordingly. See https://node-postgres.com/apis/pool
    pool: new pg.Pool({
      connectionString: env.POSTGRES_CONNECTION_URL,
    }),
  }),
});
