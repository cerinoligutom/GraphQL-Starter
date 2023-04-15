import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from './types';
import { env } from '@/config/environment';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    // You might have a more advanced config for your project.
    // Set the pool accordingly. See https://node-postgres.com/apis/pool
    pool: new Pool({
      connectionString: env.POSTGRES_CONNECTION_URL,
    }),
  }),
});
