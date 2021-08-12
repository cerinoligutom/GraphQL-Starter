/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import { GQL_SubscriptionResolvers, GQL_DummySubscriptionPayload } from '@/generated/graphql';
import { commonPubSub } from '../pubsub';

export const _dummyResolver: GQL_SubscriptionResolvers['_dummy'] = {
  resolve: (value: GQL_DummySubscriptionPayload) => {
    // The "value" parameter's value here would be the published value
    // from the pubsub.publish() method.

    // If you need the value to be transformed before sending it,
    // you can do it here.
    const preprocessedValue = value;

    // What we return here is what gets published. Just make sure it conforms
    // to the return type you defined in the schema.
    return preprocessedValue;
  },
  subscribe: (parent, args, context) => {
    // If you need filtering in subscription, use withFilter() from graphql-subscriptions
    // See https://github.com/apollographql/graphql-subscriptions#filters

    // This is only for example purposes. I only want to start the ticker
    // if this subscription resolver is queried in GraphQL Playground
    // to emulate published events.
    // Normally, the "pubsub" will be used in the business logic layer (e.g. services)
    // to notify subscribers that something happened.
    // That would then mean the implementation here would typically be simply
    // returning the "pubsub.asyncIterator(<trigger>)" unless you have other
    // things that needs to be done when this resolver is hit.
    startTicker();

    return commonPubSub.asyncIterator(commonPubSub.Triggers.DUMMY_EVENT);
  },
};

// -- Ignore --
let timeout: NodeJS.Timeout;
let count = 0;
function startTicker(): void {
  if (!timeout) {
    timeout = setInterval(async () => {
      count += 1;

      const publishedValue = `Dummy Subscription Resolver Tick # ${count}`;
      console.info(`Publishing: ${publishedValue}`);
      await commonPubSub.publishDummyEvent({
        dummy: publishedValue,
      });
    }, 1000);
  }
}
