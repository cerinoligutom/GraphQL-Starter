import { pubSubEngine } from '@/graphql/pubsub';
import { PubSubEngine } from 'graphql-subscriptions';
import { createPublishDummyEventPubSub } from './publish-dummy-event.pubsub';

enum PubSubTrigger {
  DUMMY_EVENT = 'Dummy - DUMMY',
}

function createDummyPubSub(pubsub: PubSubEngine) {
  return {
    get Trigger() {
      return PubSubTrigger;
    },
    asyncIterator: <T>(triggers: string | string[]): AsyncIterable<T> => pubsub.asyncIterator<T>(triggers),
    publishDummyEvent: createPublishDummyEventPubSub(pubsub, PubSubTrigger.DUMMY_EVENT),
  };
}

export const dummyPubSub = createDummyPubSub(pubSubEngine);
