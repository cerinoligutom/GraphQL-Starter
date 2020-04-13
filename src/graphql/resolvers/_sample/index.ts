import { GQL_QueryResolvers } from 'graphql-resolvers';

const _authorizedOnlyQuery: GQL_QueryResolvers['_authorizedOnlyQuery'] = (_, __, ctx) => {
  return ctx.ability.can('manage', 'all');
};

export default {
  Query: {
    _authorizedOnlyQuery,
    _sampleDateTimeScalar: () => new Date(),
    _sampleDateScalar: () => new Date(),
    _sampleTimeScalar: () => new Date(),
  },
};
