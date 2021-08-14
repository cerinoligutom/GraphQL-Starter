---
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/${h.changeCase.param(locals.gqlResolver?.name)}.subscription.ts` : null %>'
unless_exists: true
---
import { GQL_SubscriptionResolvers, GQL_<%= h.changeCase.pascal(locals.gqlResolver?.common?.gqlReturnTypeName) %>, GQL_Subscription<%= h.changeCase.pascal(locals.gqlResolver?.name) %>Args } from '@/generated/graphql';
import { IGraphQLSubscriptionContext } from '@/graphql';
import { <%= h.changeCase.camel(locals.module?.name) %>PubSub } from '../pubsub';
import { withFilter } from 'graphql-subscriptions';

export const <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver: GQL_SubscriptionResolvers['<%= h.changeCase.camel(locals.gqlResolver?.name) %>'] = {
  subscribe: withFilter(
    () => <%= h.changeCase.camel(locals.module?.name) %>PubSub.asyncIterator(<%= h.changeCase.camel(locals.module?.name) %>PubSub.Trigger.<%= h.changeCase.constant(locals.gqlResolver?.subscriptionResolver?.eventName) %>_EVENT),
    // TODO: Double check the auto-generated payload type here as there is a chance it might be incorrect.
    (payload: GQL_<%= h.changeCase.pascal(locals.gqlResolver?.common?.gqlReturnTypeName) %>, args: GQL_Subscription<%= h.changeCase.pascal(locals.gqlResolver?.name) %>Args, ctx: IGraphQLSubscriptionContext) => {
      // TODO: Do filtering logic here if needed. Read more at https://github.com/apollographql/graphql-subscriptions#filters
      const shouldPublish = true;
      
      return shouldPublish;
    },
  ),
};
