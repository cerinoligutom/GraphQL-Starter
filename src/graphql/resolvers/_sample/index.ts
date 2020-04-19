import { GQL_QueryResolvers } from 'graphql-resolvers';
import { ForbiddenError } from '@casl/ability';

const _authorizedOnlyQuery: GQL_QueryResolvers['_authorizedOnlyQuery'] = (_, __, ctx) => {
  ForbiddenError.from(ctx.ability).throwUnlessCan('manage', 'all');

  return true;
};

export default {
  Query: {
    _authorizedOnlyQuery,
    _sampleDateTimeScalar: () => new Date(),
    _sampleDateScalar: () => new Date(),
    _sampleTimeScalar: () => new Date(),
  },
};
