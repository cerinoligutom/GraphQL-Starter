/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import depthLimit from 'graphql-depth-limit';
import { initializeSchema } from './schema';
import { env } from '@/config/environment';
import { initLoaders } from './init-loaders';
import { handleError } from '@/errors';
import type { Server } from 'http';
import { execute, subscribe } from 'graphql';
import { IContext } from '@/shared/interfaces';
import { UUIDv4 } from '@/shared/types';
import Session, { SessionInformation } from 'supertokens-node/recipe/session';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws';
import { SubscriptionServer, GRAPHQL_WS } from 'subscriptions-transport-ws';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

export interface IGraphQLContext extends IContext {
  loaders: ReturnType<typeof initLoaders>;
}

export interface IGraphQLSubscriptionContext extends Pick<IContext, 'userId'> {
  readonly userId: UUIDv4 | null;
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

  const schema = initializeSchema();

  const apolloServer = new ApolloServer<IGraphQLContext>({
    schema,

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

    introspection: !env.isProduction,

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      env.isProduction
        ? ApolloServerPluginLandingPageProductionDefault()
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

  /**
   * It'll get messy below but there's an issue currently with the state of the protocols that can be used (subscriptions-transport-ws vs graphql-ws).
   * Read more from: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-graphql-ws-transport-library
   *
   * Bottomline is, if we use the newer and actively maintained `graphql-ws` lib, then the GraphQL Playground will not work because it uses the old protocol.
   *
   * The approach below tries to support both based on the template provided here but adjusted for our setup here.
   * https://github.com/enisdenjo/graphql-ws#ws-backwards-compat
   */

  async function createContextFromConnectionParams(
    connectionParams: IGraphQLSubscriptionConnectionParams,
  ): Promise<IGraphQLSubscriptionContext> {
    let userId: UUIDv4 | null = null;
    if (connectionParams.sessionHandle) {
      const sessionInformation: SessionInformation | undefined = await Session.getSessionInformation(
        connectionParams.sessionHandle,
      ).catch();
      userId = sessionInformation?.userId ?? null;
    }

    const context: IGraphQLSubscriptionContext = {
      userId,
    };

    return context;
  }

  // graphql-ws
  const graphqlWs = new WebSocketServer({
    path: GRAPHQL_PATH,
    noServer: true,
  });
  useServer(
    {
      schema,
      execute,
      subscribe,

      // https://github.com/enisdenjo/graphql-ws/issues/189#issuecomment-851008738
      context: (ctx) => ctx.extra.context,
      onConnect: ({ connectionParams, extra }) => {
        if (!env.isProduction) console.info('connected');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        extra.context = createContextFromConnectionParams(connectionParams as IGraphQLSubscriptionConnectionParams);
      },
      onDisconnect: ({ connectionParams }) => {
        if (!env.isProduction) console.info('disconnected');
      },
    },
    graphqlWs,
  );

  // subscriptions-transport-ws
  const subscriptionTransportWs = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,

      // See https://www.apollographql.com/docs/graphql-subscriptions/lifecycle-events/
      onConnect: async (
        connectionParams: IGraphQLSubscriptionConnectionParams,
        webSocket: Record<string, unknown>,
        connectionContext: Record<string, unknown>,
      ) => {
        if (!env.isProduction) console.info('connected');

        // https://www.apollographql.com/docs/graphql-subscriptions/authentication/
        // If you've checked the link above, Apollo's example centralizes the authentication logic in here.
        // However, you need to think about your requirements. For example, you have a chat feature
        // and the user can be kicked out of the chat any time and cannot read chat anymore.
        // Then the approach from Apollo's example wouldn't work because the socket connection would
        // still be alive since this lifecycle event will only be called once. You could set the `keepAlive`
        // property an interval value so that they get disconnected based on that but that isn't recommended
        // either. So how should you go about handling it?

        // There are multiple ways to go about this depending on your requirements. I suggest
        // checking this repo: https://github.com/viktor-br/gql-subscriptions-auth
        // Just keep in mind that as of Apollo Server 3, the subscription server has been separated
        // from the apollo server so the "context" approach will not work anymore (marker "D") from
        // https://github.com/viktor-br/gql-subscriptions-auth#authentication-and-authorization

        return createContextFromConnectionParams(connectionParams);
      },
      onDisconnect: (webSocket: Record<string, unknown>, context: Record<string, unknown>) => {
        if (!env.isProduction) console.info('disconnected');
      },
    },
    {
      path: GRAPHQL_PATH,
      noServer: true,
    },
  );

  // listen for upgrades and delegate requests according to the WS subprotocol
  httpServer.on('upgrade', (req, socket, head) => {
    // extract websocket subprotocol from header
    const protocol = req.headers['sec-websocket-protocol'];
    const protocols = Array.isArray(protocol) ? protocol : protocol?.split(',').map((p: string) => p.trim());

    // decide which websocket server to use
    const wss =
      protocols?.includes(GRAPHQL_WS) && // subscriptions-transport-ws subprotocol
      !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) // graphql-ws subprotocol
        ? subscriptionTransportWs.server
        : // graphql-ws will welcome its own subprotocol and
          // gracefully reject invalid ones. if the client supports
          // both transports, graphql-ws will prevail
          graphqlWs;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wss.handleUpgrade(req, socket as any /* believe lol */, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  // Shut down in the case of interrupt and termination signals
  // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      httpServer.close();
      process.exit();
    });
  });
};
