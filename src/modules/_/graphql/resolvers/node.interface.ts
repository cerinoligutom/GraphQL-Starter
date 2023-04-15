import { GQL_NodeResolvers } from '@/generated/graphql/index.js';

export const nodeInterfaceResolveType: GQL_NodeResolvers['__resolveType'] = (parent) => parent?.__typename ?? null;
