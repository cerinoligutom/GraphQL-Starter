---
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/pubsub/publish-${h.changeCase.param(locals.gqlResolver?.subscriptionResolver?.eventName)}-event.pubsub.ts` : null %>'
unless_exists: true
---
import { PubSubEngine } from 'graphql-subscriptions';
import { GQL_<%= h.changeCase.pascal(locals.gqlResolver?.common?.gqlReturnTypeName) %> } from '@/generated/graphql';

export const createPublish<%= h.changeCase.pascal(locals.gqlResolver?.subscriptionResolver?.eventName) %>EventPubSub =
  (pubsub: PubSubEngine, triggerName: string) =>
  // TODO: Double check the auto-generated payload type here as there is a chance it might be incorrect.
  async (payload: GQL_<%= h.changeCase.pascal(locals.gqlResolver?.common?.gqlReturnTypeName) %>): Promise<void> => {
    await pubsub.publish(triggerName, payload);
  };
