import { GQL_Resolvers } from 'graphql-resolvers';
import { singleUploadResolver } from './single-upload.mutation';
import { multipleUploadResolver } from './multiple-upload.mutation';

const resolvers: GQL_Resolvers = {
  Mutation: {
    singleUpload: singleUploadResolver,
    multipleUpload: multipleUploadResolver,
  },
};
export default resolvers;
