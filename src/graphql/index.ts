/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { initializeSchema } from './schema';
import { env } from '@/config/environment';
import { apolloOptions } from '@/config/apollo-options';
import { UniqueID } from '@/shared/types';
import { initLoaders } from './init-loaders';
import { handleError } from '@/errors';
import { Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';

export interface IGraphQLContext {
  loaders: ReturnType<typeof initLoaders>;
  req: Request;
  res: Response;
  userId?: UniqueID;
}

export const initApolloGraphqlServer = async (app: Express, httpServer: Server): Promise<void> => {
  const schema = await initializeSchema();

  const server = new ApolloServer({
    schema,

    context: async ({ req, res }) => {
      const graphqlContext: IGraphQLContext = {
        req,
        res,
        loaders: initLoaders(),
        userId: req.session?.getUserId(),
      };

      return graphqlContext;
    },

    formatError: (gqlError) => {
      // Read more here: https://www.apollographql.com/docs/apollo-server/data/errors/#for-the-client-response
      const err = handleError(gqlError);

      // BaseError props goes to "extensions.exception" so we remove that always
      delete gqlError.extensions!.exception;

      gqlError.extensions!.code = err.errorCodename;
      gqlError.extensions!.data = err.payload;
      gqlError.extensions!.stacktrace = err.stack;

      return gqlError;
    },

    validationRules: [depthLimit(10)],

    introspection: !env.isProduction,

    plugins: [],
  });

  // This middleware should be added before calling `applyMiddleware`.
  app.use(
    graphqlUploadExpress({
      // Limits here should be stricter than config for surrounding
      // infrastructure such as Nginx so errors can be handled elegantly by
      // graphql-upload:
      // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
      maxFileSize: apolloOptions.maxFileSize,
      maxFiles: apolloOptions.maxFiles,
    }),
  );

  await server.start();

  server.applyMiddleware({
    app,
    // We'll handle cors on the express app
    cors: false,
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,

      // See https://www.apollographql.com/docs/graphql-subscriptions/lifecycle-events/
      onConnect: (connectionParams: Record<string, unknown>, webSocket: Record<string, unknown>) => {
        // https://www.apollographql.com/docs/graphql-subscriptions/authentication/
        console.info('connected');

        // TODO: Do authentication checks here
        const context: Partial<Omit<IGraphQLContext, 'req' | 'res'>> = {};

        return context;
      },
      onDisconnect: (webSocket: Record<string, unknown>, context: Record<string, unknown>) => {
        console.info('disconnected');
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    },
  );

  // Shut down in the case of interrupt and termination signals
  // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      httpServer.close();
      subscriptionServer.close();
    });
  });
};
