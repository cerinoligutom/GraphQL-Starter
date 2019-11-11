import { NodeInterface } from './node.interface';
import { nodeResolver } from './node.query';
export { FileUpload } from 'graphql-upload';

export default {
  Node: NodeInterface,
  Query: {
    node: nodeResolver,
  },
};
