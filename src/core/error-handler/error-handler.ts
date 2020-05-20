import { GraphQLError } from 'graphql';
import { logger } from '@app/utils';
import { ValidationError as YupValidationError } from 'yup';
import { UserInputError, AuthenticationError, ForbiddenError as GraphQLForbiddenError, ApolloError } from 'apollo-server-express';
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
      const { inner } = error as YupValidationError;
      const validationErrors = inner.map((x) => ({
        path: x.path,
        message: x.message,
      }));

      const userInputError = new UserInputError('Invalid form', {
        formErrors: validationErrors,
      });
      userInputError.httpStatusCode = 422;
      return userInputError;

    /**
     * Convert CASL ForbiddenError to Apollo GraphQL ForbiddenError
     */
    case error instanceof CaslForbiddenError:
      const forbiddenError = new GraphQLForbiddenError(error.message);
      forbiddenError.httpStatusCode = 403;
      return forbiddenError;

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
      // The Apollo Server automatically sends errors to your
      // Apollo Graph Manager if you have configured one.
      // Check `rewriteError()` in the Apollo Server config.

      error.httpStatusCode = error?.httpStatusCode ?? 500;
      return error;
  }
}

function toGraphQLError(handledError: Error, gqlError: GraphQLError) {
  if (handledError instanceof ApolloError || handledError instanceof GraphQLError) {
    return handledError;
  }

  // Format the error to be a GraphQLError
  return new GraphQLError(
    handledError.message,
    gqlError.nodes,
    gqlError.source,
    gqlError.positions,
    gqlError.path,
    handledError,
    gqlError.extensions,
  );
}

export function handleGraphQLError(error: GraphQLError) {
  /**
   * Note:
   * "originalError" property only gets populated from errors thrown in our resolvers.
   */
  if (error.originalError instanceof Error) {
    return toGraphQLError(handleError(error.originalError!), error);
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
