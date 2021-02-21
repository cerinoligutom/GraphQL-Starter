/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express, Request, Response } from 'express';
import { ApolloError, ApolloServer, AuthenticationError } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { initializeSchema } from './schema';
import { env } from '@/config/environment';
import { apolloOptions } from '@/config/apollo-options';
import { UniqueID } from '@/shared/types';
import { initLoaders } from './init-loaders';
import { processAccessTokenFromAuthHeader } from '@/shared/helpers';
import { BaseError } from '@/errors/base.error';

export interface IGraphQLContext {
  loaders: ReturnType<typeof initLoaders>;
  req: Request;
  res: Response;
  userId?: UniqueID;
}

export const initApolloGraphqlServer = async (app: Express): Promise<ApolloServer> => {
  const server = new ApolloServer({
    schema: await initializeSchema(),

    context: async ({ req, res, connection }) => {
      const payload = processAccessTokenFromAuthHeader(req);

      const graphqlContext: IGraphQLContext = {
        req,
        res,
        loaders: initLoaders(),
        userId: payload?.userId,
      };

      if (connection) {
        // Subscription Resolver

        // Possibly check connection for metadata.

        // "context" value is the return value of "onConnect()"
        // in the "subscriptions" property below.
        const { context } = connection;

        return {
          ...graphqlContext,
          ...context,
        };
      }

      return graphqlContext;
    },

    formatError: (error) => {
      const probablyBaseError = error.originalError as BaseError;

      // BaseError props goes to "extensions.exception" so we remove that always
      delete error.extensions!.exception;

      error.extensions!.code = probablyBaseError?.errorCodename ?? 'INTERNAL_SERVER_ERROR';
      error.extensions!.data = probablyBaseError?.payload;
      error.extensions!.stacktrace = env.isProduction ? undefined : probablyBaseError?.stack;

      return error;
    },

    validationRules: [depthLimit(10)],

    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        // https://www.apollographql.com/docs/graphql-subscriptions/authentication/
        console.info('connected');

        // The value returned here goes to "connection.context" in "context" property above.
        const context: Partial<IGraphQLContext> = {};
        return context;
      },
      onDisconnect: (webSocket, context) => {
        console.info('disconnected');
      },
    },

    introspection: !env.isProduction,

    uploads: {
      // Limits here should be stricter than config for surrounding
      // infrastructure such as Nginx so errors can be handled elegantly by
      // graphql-upload:
      // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
      maxFileSize: apolloOptions.maxFileSize,
      maxFiles: apolloOptions.maxFiles,
    },

    engine: {
      apiKey: apolloOptions.apolloKey,
      graphVariant: env.app.environment,
      /**
       * You can control what gets sent over to Apollo Graph Manager thru this function.
       *
       * Read more: https://www.apollographql.com/docs/apollo-server/data/errors/#for-apollo-graph-manager-reporting
       */
      rewriteError: (err) => {
        // Return `null` to avoid reporting `AuthenticationError`s
        if (err instanceof AuthenticationError) {
          return null;
        }

        // All other errors will be reported.
        return err;
      },
    },
  });

  server.applyMiddleware({
    app,
    // We'll handle cors on the express app
    cors: false,
  });

  return server;
};
