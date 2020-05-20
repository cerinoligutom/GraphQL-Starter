import { GQL_Resolvers } from 'graphql-resolvers';
import { nodeResolver } from './node.query';
import { nodeInterfaceResolveType } from './node.interface';

const resolvers: GQL_Resolvers = {
  Node: {
    __resolveType: nodeInterfaceResolveType,
  },
  Query: {
    node: nodeResolver,
  },
};
export default resolvers;
