import { GQL_SubscriptionResolvers, GQL_DummySubscriptionPayload } from 'graphql-resolvers';
import { pubsub, PubSubTriggers } from '@app/graphql/pubsub';

export const _dummyResolver: GQL_SubscriptionResolvers['_dummy'] = {
  resolve: (value: GQL_DummySubscriptionPayload) => {
    // NOTE:
    // The "value" argument here is what gets published, for this example,
    // we're expecting a string to be published so we give it that type
    // If you need the value to be transformed in any way, the resolve
    // field is one way to do it.

    return value;
  },
  subscribe: (parent, args, context) => {
    // If you need filtering in subscription, use withFilter() from graphql-subscriptions
    // See https://github.com/apollographql/graphql-subscriptions#filters

    // NOTE:
    // This is only for example purposes. I only want to start the ticker
    // if this subscription resolver is queried in GraphQL Playground
    // to emulate published events.
    // Normally, the "pubsub" will be used in the business logic layer (e.g. services)
    // to notify subscribers that something happened.
    // That would then mean the implementation here would typically be simply
    // returning the "pubsub.asyncIterator(<trigger>)" unless you have other
    // things that needs to be done when this resolver is hit.
    startTicker();

    return pubsub.asyncIterator(PubSubTriggers.DUMMY_EVENT);
  },
};

// -- Ignore --
let timeout: NodeJS.Timeout;
let count = 0;
function startTicker() {
  if (!timeout) {
    timeout = setInterval(async () => {
      count = count + 1;

      const publishedValue = `Dummy Subscription Resolver Tick # ${count}`;
      console.info(`Publishing: ${publishedValue}`);
      await pubsub.publishTestEvent({
        dummy: publishedValue,
      });
    }, 1000);
  }
}
