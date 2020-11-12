import { GQL_QueryResolvers } from '@app/graphql-schema-types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _dummyResolver: GQL_QueryResolvers['_dummy'] = async () => {
  return 'Dummy Query Resolver';
};
