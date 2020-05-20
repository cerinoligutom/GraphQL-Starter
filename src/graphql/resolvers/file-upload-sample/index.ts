import { GQL_Resolvers } from 'graphql-resolvers';
import { singleUploadResolver } from './singleUpload.mutation';
import { multipleUploadResolver } from './multipleUpload.mutation';

const resolvers: GQL_Resolvers = {
  Mutation: {
    singleUpload: singleUploadResolver,
    multipleUpload: multipleUploadResolver,
  },
};
export default resolvers;
