import { NodeInterface } from './node.interface';
import { nodeResolver } from './node.query';

export default {
  Node: NodeInterface,
  Query: {
    node: nodeResolver,
  },
};
