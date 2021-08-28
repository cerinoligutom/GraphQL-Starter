/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import { GQL_SubscriptionResolvers, GQL_DummySubscriptionPayload } from '@/generated/graphql';
import { IGraphQLSubscriptionContext } from '@/graphql';
import { dummyPubSub } from '../pubsub';

export const _dummyResolver: GQL_SubscriptionResolvers['_dummy'] = {
  resolve: (value: GQL_DummySubscriptionPayload, args: unknown, ctx: IGraphQLSubscriptionContext) => {
    // You can also do AuthN/AuthZ checks here. Read more from the link below:
    // https://github.com/viktor-br/gql-subscriptions-auth#authentication-and-authorization

    // The "value" parameter's value here would be the published value
    // from the pubsub.publish() method.

    // If you need the value to be transformed before sending it, you can ALSO do it here.
    // Emphasis on "ALSO" because if you're making use of the pattern used on the sample
    // publish-dummy-event.pubsub.ts, then you wouldn't need to do any transformation here
    // since the return type from the graphql schema is already what's being asked to be published
    // from the abstracted pubsub publish <x> events.
    // Depending on your requirements, you can always change that. Just make sure to change
    // the type of the value parameter here accordingly then do the transformations here.
    const preprocessedValue = value;

    // What we return here is what the client receives. Just make sure it conforms
    // to the return type you defined in the schema.
    return preprocessedValue;
  },
  subscribe: (parent, args, context) => {
    // If you need filtering in subscription, use withFilter() from graphql-subscriptions
    // See https://github.com/apollographql/graphql-subscriptions#filters

    // This is only for example purposes. I only want to start the ticker
    // if this subscription resolver is queried in GraphQL Playground
    // to emulate published events.
    // Normally, the "pubsub" will be used in the business logic layer (e.g. use cases, services)
    // to notify subscribers that something happened.
    // That would then mean the implementation here would typically be simply
    // returning the "pubsub.asyncIterator(<trigger>)" unless you have other
    // things that needs to be done when this resolver is hit.
    startTicker();

    return dummyPubSub.asyncIterator(dummyPubSub.Trigger.DUMMY_EVENT);
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
      await dummyPubSub.publishDummyEvent({
        dummy: publishedValue,
      });
    }, 1000);
  }
}
