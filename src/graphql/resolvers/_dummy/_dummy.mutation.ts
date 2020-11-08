import { GQL_MutationResolvers } from '@app/graphql-schema-types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _dummyResolver: GQL_MutationResolvers['_dummy'] = async () => {
  return 'Dummy Mutation Resolver';
};
