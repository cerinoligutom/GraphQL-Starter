import { InternalServerError } from '../internal-server.error';
import { BaseError } from '../base.error';
import { ApolloError } from 'apollo-server-express';
import { objectionDbErrorHandler } from './objection-db.error-handler';
import { ErrorHandler } from '@/shared/types';
import { GraphQLError } from 'graphql';
import { DatabaseError } from '../database.error';
import { env } from '@/config/environment';

/**
 * Handles the error and normalizes it to the application's `BaseError`.
 *
 * This function should only be called on the edges of your interface layer.
 * When it's about to respond to your client for errors.
 *
 * @param err Any instance of the Error class.
 */
export function handleError(err: Error): BaseError {
  let unknownError: Error = err;

  // Extract the original error from Apollo GraphQL errors.
  if (err instanceof ApolloError || err instanceof GraphQLError) {
    const { originalError } = err;

    unknownError = originalError;
  }

  // If it still isn't a known Error, meaning it doesn't inherit BaseError,
  // try our custom error handlers which normalizes 3rd party errors into
  // our custom errors.
  if (!(unknownError instanceof BaseError)) {
    // Only pass custom error handlers here to keep this file clean
    // and maintain single responsibility. Do not handle unknown
    // errors on your custom error handlers. Instead, return "null"
    // so that it gets inside our custom InternalServerError class.
    const errorHandlers: ErrorHandler[] = [objectionDbErrorHandler];

    for (const errorHandler of errorHandlers) {
      const normalizedError = errorHandler(unknownError);

      if (normalizedError) {
        unknownError = normalizedError;
        break;
      }
    }
  }

  // After passing through our custom handlers, if "unknownError" is finally
  // an instance of our BaseError, then we can do final touches here.
  if (unknownError instanceof BaseError) {
    const baseError = unknownError;

    if (env.isProduction) {
      // Such as obscuring Database Errors on production
      if (baseError instanceof DatabaseError) {
        baseError.message = 'Oops! Something went wrong in the database.';
      }

      // And not returning the stacktrace
      baseError.stack = undefined;
    }

    return baseError;
  }

  // Otherwise, it's a truly unknown and unhandled error
  return new InternalServerError(unknownError);
}
