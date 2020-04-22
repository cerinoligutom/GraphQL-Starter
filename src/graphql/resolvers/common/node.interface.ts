import { GQL_NodeResolvers } from 'graphql-resolvers';

export const nodeInterfaceResolveType: GQL_NodeResolvers['__resolveType'] = (parent) => {
  return parent?.__typename ?? null;
};
