import { nodeResolver } from './node.query';
import { nodeInterfaceResolveType } from './node.interface';

export default {
  Node: {
    __resolveType: nodeInterfaceResolveType,
  },
  Query: {
    node: nodeResolver,
  },
};
