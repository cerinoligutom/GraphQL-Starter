import { GraphQLError } from 'graphql';
import { logger } from '@app/utils';
import { ValidationError as YupValidationError } from 'yup';
import { UserInputError, AuthenticationError, ForbiddenError as GraphQLForbiddenError } from 'apollo-server-express';
import { ForbiddenError as CaslForbiddenError } from '@casl/ability';

declare global {
  interface Error {
    httpStatusCode?: number;
  }
}

/**
 * Some things to note:
 *
 * 1. Notice the `httpStatusCode` property. Our ExpressJS error middleware uses this function
 * as well directly for other requests to have a centralized error handler for both our
 * GraphQL and REST endpoints.
 *
 * 2. The order of the switch cases matter here. If you have an error that inherits another
 * error, then when handling it here, make sure to put it higher than the inherited error class.
 */
export function handleError(error: Error): Error {
  switch (true) {
    /**
     * Convert Yup ValidationError to Apollo GraphQL UserInputError
     */
    case error instanceof YupValidationError:
      error.httpStatusCode = 422;
      return new UserInputError('Invalid form', error);

    /**
     * Convert CASL ForbiddenError to Apollo GraphQL ForbiddenError
     */
    case error instanceof CaslForbiddenError:
      error.httpStatusCode = 403;
      return new GraphQLForbiddenError(error.message);

    /**
     * GraphQL Errors
     */
    case error instanceof AuthenticationError:
      error.httpStatusCode = 401;
      return error;
    case error instanceof GraphQLForbiddenError:
      error.httpStatusCode = 403;
      return error;

    /**
     * This could either be a truly unhandled Internal Server Error
     * or a custom error that are self sufficient.
     * Otherwise, you should be handling known errors above.
     */
    default:
      // Log unhandled errors to server's console
      logger.error(`${error.message}`);
      logger.error(`${error.stack}`);

      // IMPORTANT:
      // If you have metrics stuffs, you might want to do the
      // error tracker stuffs here.

      error.httpStatusCode = error?.httpStatusCode ?? 500;
      return error;
  }
}

export function handleGraphQLError(error: GraphQLError) {
  /**
   * Note:
   * "originalError" property only gets populated from errors thrown in our resolvers.
   */
  if (error.originalError instanceof Error) {
    return handleError(error.originalError!);
  }

  /**
   * If the error was thrown outside of our resolvers,
   * then it's an error outside of our control so we'll
   * just return the error as is.
   *
   * For example: Requesting an invalid query from the playground
   */
  return error;
}
