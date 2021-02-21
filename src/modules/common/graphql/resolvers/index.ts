import { GQL_Resolvers } from '@/generated/graphql';
import { _dummyResolver as _dummyQueryResolver } from './_dummy.query';
import { _dummyResolver as _dummyMutationResolver } from './_dummy.mutation';
import { _dummyResolver as _dummySubscriptionResolver } from './_dummy.subscription';
import { singleUploadResolver } from './single-upload.mutation';
import { multipleUploadResolver } from './multiple-upload.mutation';
import { nodeInterfaceResolveType } from './node.interface';

const resolvers: GQL_Resolvers = {
  Node: {
    __resolveType: nodeInterfaceResolveType,
  },
  Query: {
    _dummy: _dummyQueryResolver,
  },
  Mutation: {
    _dummy: _dummyMutationResolver,
    singleUpload: singleUploadResolver,
    multipleUpload: multipleUploadResolver,
  },
  Subscription: {
    _dummy: _dummySubscriptionResolver,
  },
};
export default resolvers;
