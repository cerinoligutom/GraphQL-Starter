import { Node } from './node.interface';
import { node } from './node.query';
import { FileUpload } from 'graphql-upload';

// Only used as a mapper for GraphQL Code Generator (codegen.yml)
export type FileUpload = Promise<FileUpload>;

export default {
  Node,
  Query: {
    node,
  },
};
