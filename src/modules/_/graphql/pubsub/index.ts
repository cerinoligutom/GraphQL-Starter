import { pubSubEngine } from '@/graphql/pubsub';
import { PubSubEngine } from 'apollo-server-express';
import { createPublishDummyEventPubSub } from './publish-dummy-event.pubsub';

enum CommonPubSubTrigger {
  DUMMY_EVENT = 'DUMMY_EVENT',
}

function createCommonPubSub(pubsub: PubSubEngine) {
  return {
    get Triggers() {
      return CommonPubSubTrigger;
    },
    asyncIterator: <T>(triggers: CommonPubSubTrigger | CommonPubSubTrigger[]): AsyncIterator<T> => pubsub.asyncIterator<T>(triggers),
    publishDummyEvent: createPublishDummyEventPubSub(pubsub, CommonPubSubTrigger.DUMMY_EVENT),
  };
}

export const commonPubSub = createCommonPubSub(pubSubEngine);
