/* eslint-disable @typescript-eslint/naming-convention */
import { GQL_QueryResolvers, GQL_Resolvers } from '@app/graphql-schema-types';
import { ForbiddenError } from '@casl/ability';

const _authorizedOnlyQuery: GQL_QueryResolvers['_authorizedOnlyQuery'] = (_, __, ctx) => {
  ForbiddenError.from(ctx.ability).throwUnlessCan('manage', 'all');

  return true;
};

const _sampleDateTimeScalar: GQL_QueryResolvers['_sampleDateTimeScalar'] = () => new Date();
const _sampleDateScalar: GQL_QueryResolvers['_sampleDateScalar'] = () => new Date();
const _sampleTimeScalar: GQL_QueryResolvers['_sampleTimeScalar'] = () => new Date();

const resolvers: GQL_Resolvers = {
  Query: {
    _authorizedOnlyQuery,
    _sampleDateTimeScalar,
    _sampleDateScalar,
    _sampleTimeScalar,
  },
};
export default resolvers;
