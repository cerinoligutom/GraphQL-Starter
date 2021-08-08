---
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/pubsub/index.ts` : null %>'
unless_exists: true
---
import { pubSubEngine } from '@/graphql/pubsub';
import { PubSubEngine } from 'graphql-subscriptions';

enum PubSubTrigger {
}

function create<%= h.changeCase.pascal(locals.module?.name) %>PubSub(pubsub: PubSubEngine) {
  return {
    get Trigger() {
      return PubSubTrigger;
    },
    asyncIterator: <T>(triggers: string | string[]): AsyncIterator<T> => pubsub.asyncIterator<T>(triggers),
  };
}

export const <%= h.changeCase.camel(locals.module?.name) %>PubSub = create<%= h.changeCase.pascal(locals.module?.name) %>PubSub(pubSubEngine);
