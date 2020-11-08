/* eslint-disable @typescript-eslint/naming-convention */
import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { publishDummyEvent } from './publish-dummy-event.pubsub';
import { PubSubTrigger } from './pubsub-trigger';

export { PubSubTrigger };

// NOTE:
// Note that the default PubSub implementation is intended for demo purposes.
// It only works if you have a single instance of your server and doesn't scale
// beyond a couple of connections. For production usage you'll want to use one
// of the PubSub implementations backed by an external store. (e.g. Redis)
// See: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#pubsub-implementations
const _pubsub: PubSubEngine = new PubSub();

export const pubsub = {
  asyncIterator: <T>(triggers: PubSubTrigger | PubSubTrigger[]): AsyncIterator<T> => _pubsub.asyncIterator<T>(triggers),
  // Add your action creators below
  publishTestEvent: publishDummyEvent(_pubsub),
};
