/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { initializeSchema } from './schema';
import { env } from '@/config/environment';
import { apolloOptions } from '@/config/apollo-options';
import { initLoaders } from './init-loaders';
import { handleError } from '@/errors';
import { Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { IContext, ISessionData } from '@/shared/interfaces';
import { UniqueID } from '@/shared/types';
import Session from 'supertokens-node/recipe/session';

export interface IGraphQLContext extends IContext {
  loaders: ReturnType<typeof initLoaders>;
}

export interface IGraphQLSubscriptionContext extends Pick<IContext, 'userId'> {
  readonly userId: UniqueID | null;
}

interface IGraphQLSubscriptionConnectionParams {
  /**
   * If you want to determine who is making the request and do AuthN/AuthZ checks based on that user,
   * make sure the frontend client passes the `sessionHandle` variable which they can retrieve by
   * reading the JWT Payload from the frontend client using the `supertokens-website` SDK.
   * */
  sessionHandle?: string;
}

export const initApolloGraphqlServer = async (app: Express, httpServer: Server): Promise<void> => {
  const schema = await initializeSchema();

  const server = new ApolloServer({
    schema,

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

        let userId: UniqueID | null = null;
        if (connectionParams.sessionHandle) {
          // https://supertokens.io/docs/nodejs/session/getsessiondata
          const sessionData: ISessionData | undefined = await Session.getSessionData(connectionParams.sessionHandle).catch();
          userId = sessionData?.userId ?? null;
        }

        const context: IGraphQLSubscriptionContext = {
          userId,
        };

        return context;
      },
      onDisconnect: (webSocket: Record<string, unknown>, context: Record<string, unknown>) => {
        if (!env.isProduction) console.info('disconnected');
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
      process.exit();
    });
  });
};
