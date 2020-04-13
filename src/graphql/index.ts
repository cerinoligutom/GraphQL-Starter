import { Express, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { schema } from './schema';
import { initLoaders } from '../graphql-dataloaders';
import { env } from '@app/config/environment';
import * as services from '@app/core/services';
import { logger } from '@app/utils';
import { apolloOptions } from '@app/config/apollo-options';
import { defineSystemAbilitiesFor } from '@app/core/authorization';
import { Await } from '@app/core/types/Await';

export interface IGraphQLContext {
  services: typeof services;
  loaders: ReturnType<typeof initLoaders>;
  req: Request;
  res: Response;
  ability: Await<ReturnType<typeof defineSystemAbilitiesFor>>;
}

export const initApolloGraphqlServer = (app: Express) => {
  const server = new ApolloServer({
    schema,

    context: async ({ req, res, connection }) => {
      const graphqlContext: IGraphQLContext = {
        services,
        req,
        res,
        loaders: initLoaders(),
        ability: await defineSystemAbilitiesFor(req.user?.id),
      };

      if (connection) {
        // Subscription Resolver

        // Possibly check connection for metadata.

        // "context" value is the return value of "onConnect()"
        // in the "subscriptions" property below.
        const { context } = connection;

        return {
          ...context,
          ...graphqlContext,
        };
      }

      return graphqlContext;
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

    formatError: (err) => {
      // https://www.apollographql.com/docs/apollo-server/features/errors.html#Masking-and-logging-errors

      // Log error to server's console
      logger.error(`${err}`);

      // Do not send the exception object to the client
      // for 500 errors when in production
      if (env.isProduction) {
        if (err.extensions!.code === 'INTERNAL_SERVER_ERROR') {
          err.message = 'Oops! Something went wrong.';
          if (err.extensions && err.extensions.exception) {
            err.extensions.exception.stacktrace = undefined;
          }
        }
      }

      return err;
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
      apiKey: apolloOptions.engineApiKey,
      schemaTag: env.environment,
    },
  });

  server.applyMiddleware({
    app,
    // We'll handle cors on the express app
    cors: false,
  });

  return server;
};
