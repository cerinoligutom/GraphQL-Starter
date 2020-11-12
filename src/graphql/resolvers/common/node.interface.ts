import { GQL_NodeResolvers } from '@app/graphql-schema-types';

export const nodeInterfaceResolveType: GQL_NodeResolvers['__resolveType'] = (parent) => {
  return parent?.__typename ?? null;
};
