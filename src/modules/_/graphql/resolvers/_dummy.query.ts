import { GQL_QueryResolvers } from '@/generated/graphql/index.js';

export const _dummyResolver: GQL_QueryResolvers['_dummy'] = async () => 'Dummy Query Resolver';
