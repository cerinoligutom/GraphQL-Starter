import { ErrorHandler } from '@/shared/types/index.js';
import pg from 'pg';
import { DatabaseError } from '../database.error.js';

const { DatabaseError: PostgresDatabaseError } = pg;

// Refine this based on the database you're using and errors you want to handle.
// For Postgres: https://www.postgresql.org/docs/current/errcodes-appendix.html
export const pgErrorHandler: ErrorHandler = (err) => {
  if (err instanceof PostgresDatabaseError) {
    return new DatabaseError({
      originalError: err,
      httpStatusCode: 500,
      message: err.message,
      payload: {
        code: err.code,
        table: err.table,
        constraint: err.constraint,
      },
    });
  }

  return null;
};
