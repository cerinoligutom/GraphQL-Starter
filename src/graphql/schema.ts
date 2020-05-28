import path from 'path';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFiles } from '@graphql-tools/load-files';
import { makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { schemaPermissions } from '../graphql-shield';
import * as scalars from './scalars';
import * as enums from './enums';

const getTypeDefs = async () => {
  return loadFiles(path.join(__dirname, 'typeDefs/*.graphql'));
};

const getResolvers = async () => {
  return loadFiles(path.join(__dirname, 'resolvers/**/index.*'), { ignoreIndex: false, extensions: ['.js', '.ts'] });
};

export const initializeSchema = async () => {
  // Create schema
  const resolvers = {
    ...mergeResolvers(await getResolvers()),
    ...enums,
    ...scalars,
  };

  const typeDefs = mergeTypeDefs(await getTypeDefs());

  let graphqlSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
    logger: { log: (e) => console.info(e) },
  });

  // Apply graphql-shield middleware
  graphqlSchema = applyMiddleware(graphqlSchema, schemaPermissions);

  return graphqlSchema;
};
