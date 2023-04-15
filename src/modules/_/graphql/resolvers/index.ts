import { GQL_Resolvers } from '@/generated/graphql/index.js';
import { _dummyResolver as _dummyQueryResolver } from './_dummy.query.js';
import { _dummyResolver as _dummyMutationResolver } from './_dummy.mutation.js';
import { _dummyResolver as _dummySubscriptionResolver } from './_dummy.subscription.js';
import { nodeInterfaceResolveType } from './node.interface.js';
import { _dateResolver } from './_date.query.js';
import { _datetimeResolver } from './_datetime.query.js';
import { _timeResolver } from './_time.query.js';

const resolvers: GQL_Resolvers = {
  Node: {
    __resolveType: nodeInterfaceResolveType,
  },
  Query: {
    _dummy: _dummyQueryResolver,
    _date: _dateResolver,
    _datetime: _datetimeResolver,
    _time: _timeResolver,
  },
  Mutation: {
    _dummy: _dummyMutationResolver,
  },
  Subscription: {
    _dummy: _dummySubscriptionResolver,
  },
};
export default resolvers;
