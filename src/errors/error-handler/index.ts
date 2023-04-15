import { InternalServerError } from '../internal-server.error.js';
import { BaseError } from '../base.error.js';
import { ErrorHandler } from '@/shared/types/index.js';
import { DatabaseError } from '../database.error.js';
import { env } from '@/config/environment.js';
import { unwrapResolverError } from '@apollo/server/errors';
import { pgErrorHandler } from './pg.error-handler.js';

/**
 * Handles the error and normalizes it to the application's `BaseError`.
 *
 * This function should only be called on the edges of your interface layer.
 * When it's about to respond to your client for errors.
 *
 * @param unknownError Any instance of the Error class.
 */
export function handleError(unknownError: Error): BaseError {
  let error: Error = unknownError;

  // Extract the original error from GraphQL Resolver errors.
  error = unwrapResolverError(unknownError) as Error;

  // If it still isn't a known Error, meaning it doesn't inherit BaseError,
  // try our custom error handlers which normalizes 3rd party errors into
  // our custom errors.
  if (!(error instanceof BaseError)) {
    // Only pass custom error handlers here to keep this file clean
    // and maintain single responsibility. Do not handle unknown
    // errors on your custom error handlers. Instead, return "null"
    // so that it gets normalized into our custom InternalServerError
    // class after this step.
    const errorHandlers: ErrorHandler[] = [pgErrorHandler];

    for (const errorHandler of errorHandlers) {
      const normalizedError = errorHandler(error);

      if (normalizedError) {
        error = normalizedError;
        break;
      }
    }
  }

  // If the unknown error doesn't normalize into our BaseError
  if (!(error instanceof BaseError)) {
    // Then it's a truly unknown and unhandled error so we normalize it
    // into our custom InternalServerError.
    error = new InternalServerError('An unhandled error has occurred', error);
  }

  // During production, you might want to do something with the error object.
  if (env.isProduction) {
    // Such as obscuring Database Errors on production
    if (error instanceof DatabaseError) {
      error.message = 'Oops! Something went wrong in the database.';
      error.payload = undefined;
    }

    // Not returning the stacktrace
    error.stack = undefined;
  }

  // At this point, we're confident it'll be a BaseError so we'll assert it.
  return error as BaseError;
}
