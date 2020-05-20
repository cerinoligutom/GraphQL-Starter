import { GQL_Resolvers } from 'graphql-resolvers';
import { _dummyResolver as _dummyQueryResolver } from './_dummy.query';
import { _dummyResolver as _dummyMutationResolver } from './_dummy.mutation';
import { _dummyResolver as _dummySubscriptionResolver } from './_dummy.subscription';

const resolvers: GQL_Resolvers = {
  Query: {
    _dummy: _dummyQueryResolver,
  },
  Mutation: {
    _dummy: _dummyMutationResolver,
  },
  Subscription: {
    _dummy: _dummySubscriptionResolver,
  },
};
export default resolvers;
