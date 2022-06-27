import { GQL_Resolvers } from '@/generated/graphql';
import { _dummyResolver as _dummyQueryResolver } from './_dummy.query';
import { _dummyResolver as _dummyMutationResolver } from './_dummy.mutation';
import { _dummyResolver as _dummySubscriptionResolver } from './_dummy.subscription';
import { nodeInterfaceResolveType } from './node.interface';
import { _dateResolver } from './_date.query';
import { _datetimeResolver } from './_datetime.query';
import { _timeResolver } from './_time.query';

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
