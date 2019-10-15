import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { schema } from './schema';
import { initLoaders } from '../graphql-dataloaders';
import { env } from '@app/config/environment';
import * as services from '@app/core/services';
import { jwtUtil, logger } from '@app/utils';

export interface IGraphQLContext {
  userId: string | null;
  services: typeof services;
  loaders: ReturnType<typeof initLoaders>;
}

export const initApolloGraphqlServer = (app: Express) => {
  const server = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      const graphqlContext: IGraphQLContext = {
        services,
        userId: null,
        loaders: initLoaders(),
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

      // Query/Mutation Resolver (check from "req")
      const payload = jwtUtil.validateToken(req.headers.authorization);
      const userId = payload ? payload.userId : null;
      graphqlContext.userId = userId;

      return graphqlContext;
    },
    validationRules: [depthLimit(10)],
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        // https://www.apollographql.com/docs/graphql-subscriptions/authentication/
        console.info('connected');

        // The value returned here goes to "connection.context" in "context" property above.
        return {} as Partial<IGraphQLContext>;
      },
      onDisconnect: (webSocket, context) => {
        console.info('disconnected');
      },
    },
    formatError: err => {
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
      maxFileSize: 10000000, // 10 MB
      maxFiles: 20,
    },
    engine: {
      apiKey: process.env.ENGINE_API_KEY,
      schemaTag: env.environment,
    },
  });

  server.applyMiddleware({
    app,
  });

  return server;
};
