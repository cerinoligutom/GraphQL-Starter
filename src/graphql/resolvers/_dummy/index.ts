import { _dummyResolver as _dummyQueryResolver } from './_dummy.query';
import { _dummyResolver as _dummyMutationResolver } from './_dummy.mutation';
import { _dummyResolver as _dummySubscriptionResolver } from './_dummy.subscription';

export default {
  Query: {
    _dummy: _dummyQueryResolver,
    _sampleDateTimeScalar: () => new Date(),
    _sampleDateScalar: () => new Date(),
    _sampleTimeScalar: () => new Date(),
  },
  Mutation: {
    _dummy: _dummyMutationResolver,
  },
  Subscription: {
    _dummy: _dummySubscriptionResolver,
  },
};
