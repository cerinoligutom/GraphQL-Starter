import { GQL_QueryResolvers } from '@/generated/graphql/index.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _dummyResolver: GQL_QueryResolvers['_dummy'] = async () => 'Dummy Query Resolver';
