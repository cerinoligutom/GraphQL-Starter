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
 * @param unknownError Any instance of the Error class.
 */
export function handleError(unknownError: Error): BaseError {
  let error: Error = unknownError;

  // Extract the original error from Apollo GraphQL errors.
  if (unknownError instanceof ApolloError || unknownError instanceof GraphQLError) {
    error = unknownError.originalError as Error;
  }

  // If it still isn't a known Error, meaning it doesn't inherit BaseError,
  // try our custom error handlers which normalizes 3rd party errors into
  // our custom errors.
  if (!(error instanceof BaseError)) {
    // Only pass custom error handlers here to keep this file clean
    // and maintain single responsibility. Do not handle unknown
    // errors on your custom error handlers. Instead, return "null"
    // so that it gets inside our custom InternalServerError class.
    const errorHandlers: ErrorHandler[] = [objectionDbErrorHandler];

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
    }

    // Not returning the stacktrace
    error.stack = undefined;
  }

  // At this point, we're confident it'll be a BaseError so we'll assert it.
  return error as BaseError;
}
