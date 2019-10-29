import { singleUploadResolver } from './singleUpload.mutation';
import { multipleUploadResolver } from './multipleUpload.mutation';

export default {
  Mutation: {
    singleUpload: singleUploadResolver,
    multipleUpload: multipleUploadResolver,
  },
};
