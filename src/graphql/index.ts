/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Express } from 'express';
import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import depthLimit from 'graphql-depth-limit';
import { initializeSchema } from './schema.js';
import { env } from '@/config/environment.js';
import { initLoaders } from './init-loaders.js';
import { handleError } from '@/errors/index.js';
import type { Server } from 'http';
import { IContext } from '@/shared/interfaces/index.js';
import Session, { SessionInformation } from 'supertokens-node/recipe/session/index.js';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

export interface IGraphQLContext extends IContext, BaseContext {
  loaders: ReturnType<typeof initLoaders>;
}

export interface IGraphQLSubscriptionContext extends Pick<IContext, 'userId'> {
  readonly userId: string | null;
}

interface IGraphQLSubscriptionConnectionParams {
  /**
   * If you want to determine who is making the request and do AuthN/AuthZ checks based on that user,
   * make sure the frontend client passes the `sessionHandle` variable which they can retrieve by
   * reading the Access Token Payload from the frontend client using the `supertokens-website` SDK.
   * */
  sessionHandle?: string;
}

export const initApolloGraphqlServer = async (app: Express, httpServer: Server): Promise<void> => {
  const GRAPHQL_PATH = '/graphql';
  const schema = await initializeSchema();

  ///////////////////////////////////////
  // Setup GraphQL Subscription Server //
  ///////////////////////////////////////

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: GRAPHQL_PATH,
  });
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx): Promise<IGraphQLSubscriptionContext> => {
        // As for why we're taking `connectionParams` as an example is because it's what you can pass from Apollo CLient
        // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#example-authentication-with-apollo-client
        const connectionParams = (ctx.connectionParams ?? {}) as IGraphQLSubscriptionConnectionParams;

        let userId: string | null = null;
        if (connectionParams.sessionHandle) {
          const sessionHandle = connectionParams.sessionHandle as string;

          const sessionInformation: SessionInformation | undefined = await Session.getSessionInformation(sessionHandle).catch();

          userId = sessionInformation?.userId ?? null;
        }

        return {
          userId,
        };
      },
      onConnect: async (ctx) => {
        if (!env.isProduction) console.info('Client connected');

        /**
         * FIXME: Think about how you want to handle your authentication with WebSockets.
         * You could check `sessionHandle` from `connectionParams` here and return false if it's invalid.
         *
         * Here are some recipes you can use as reference:
         * - https://the-guild.dev/graphql/ws/recipes#server-usage-with-ws-and-custom-auth-handling
         * - https://the-guild.dev/graphql/ws/recipes#ws-server-and-client-auth-usage-with-token-expiration-validation-and-refresh
         */
      },
      onDisconnect: () => {
        if (!env.isProduction) console.info('Client disconnected');
      },
    },
    wsServer,
  );

  /////////////////////////
  // Setup Apollo Server //
  /////////////////////////

  const apolloServer = new ApolloServer<IGraphQLContext>({
    schema,
    introspection: !env.isProduction,

    formatError: (gqlFormattedError, error) => {
      const err = handleError(error as Error);

      return {
        ...gqlFormattedError,
        extensions: {
          ...gqlFormattedError.extensions,
          code: err.errorCodename,
          data: err.payload,
          stacktrace: err.stack,
        },
      };
    },
    validationRules: [depthLimit(10)],
    plugins: [
      // Proper shutdown for the HTTP Server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket Server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      // GraphQL endpoint landing page.
      env.isProduction
        ? ApolloServerPluginLandingPageProductionDefault({ includeCookies: true })
        : ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }),
    ],

    // Regression issue. Should be addressed in v5.
    // https://www.apollographql.com/docs/apollo-server/migration/#appropriate-400-status-codes
    status400ForVariableCoercionErrors: true,
  });
  await apolloServer.start();

  app.use(
    GRAPHQL_PATH,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const context: IContext = {
          ...req.context,
        };

        const graphqlContext: IGraphQLContext = {
          ...context,
          loaders: initLoaders({ ...context }),
        };

        return graphqlContext;
      },
    }),
  );
};
