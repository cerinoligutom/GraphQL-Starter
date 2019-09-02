import path from 'path';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { schemaPermissions } from '../graphql-shield';
import { scalars } from './scalars';
import * as enums from './enums';

const getTypeDefs = () => {
  return fileLoader(path.join(__dirname, 'typeDefs/*.graphql'));
};

const getResolvers = () => {
  return fileLoader(path.join(__dirname, 'resolvers/**/index.ts'), { ignoreIndex: false });
};

// Create schema
const resolvers = {
  ...mergeResolvers(getResolvers()),
  ...enums,
  ...scalars,
};

const typeDefs = mergeTypes(getTypeDefs());

let graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: { log: e => console.info(e) },
});

// Apply graphql-shield middleware
graphqlSchema = applyMiddleware(graphqlSchema, schemaPermissions);

export const schema = graphqlSchema;
