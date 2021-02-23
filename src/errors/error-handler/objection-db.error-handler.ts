import { ErrorHandler } from '@/shared/types';
import {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection';
import { DatabaseError } from '../database.error';

// Derived from Derived from: https://vincit.github.io/objection.js/recipes/error-handling.html#examples
export const objectionDbErrorHandler: ErrorHandler = (err) => {
  if (err instanceof ValidationError) {
    return new DatabaseError({
      httpStatusCode: 400,
      message: err.message,
      payload: {
        type: err.type,
        ...err.data,
      },
      originalError: err,
    });
  }

  if (err instanceof NotFoundError) {
    return new DatabaseError({
      httpStatusCode: 404,
      message: err.message,
      payload: {
        type: 'NotFound',
        ...err.data,
      },
      originalError: err,
    });
  }

  if (err instanceof UniqueViolationError) {
    return new DatabaseError({
      httpStatusCode: 409,
      message: err.message,
      payload: {
        type: 'UniqueViolation',
        columns: err.columns,
        table: err.table,
        constraint: err.constraint,
      },
      originalError: err,
    });
  }

  if (err instanceof NotNullViolationError) {
    return new DatabaseError({
      httpStatusCode: 400,
      message: err.message,
      payload: {
        type: 'NotNullViolation',
        column: err.column,
        table: err.table,
      },
      originalError: err,
    });
  }

  if (err instanceof ForeignKeyViolationError) {
    return new DatabaseError({
      httpStatusCode: 409,
      message: err.message,
      payload: {
        type: 'ForeignKeyViolation',
        table: err.table,
        constraint: err.constraint,
      },
      originalError: err,
    });
  }

  if (err instanceof ConstraintViolationError) {
    return new DatabaseError({
      httpStatusCode: 409,
      message: err.message,
      payload: {
        type: 'ForeignKeyViolation',
      },
      originalError: err,
    });
  }

  if (err instanceof CheckViolationError) {
    return new DatabaseError({
      httpStatusCode: 400,
      message: err.message,
      payload: {
        type: 'CheckViolation',
        table: err.table,
        constraint: err.constraint,
      },
      originalError: err,
    });
  }

  if (err instanceof DataError) {
    return new DatabaseError({
      httpStatusCode: 400,
      message: err.message,
      payload: {
        type: 'InvalidData',
      },
      originalError: err,
    });
  }

  if (err instanceof DBError) {
    return new DatabaseError({
      httpStatusCode: 500,
      message: err.message,
      payload: {
        type: 'UnknownDatabaseError',
      },
      originalError: err,
    });
  }

  return null;
};
