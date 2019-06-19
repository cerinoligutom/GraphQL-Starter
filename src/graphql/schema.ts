import path from 'path';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { schemaPermissions } from '../graphql-shield';
import { scalars } from './scalars';
import * as enums from './enums';
import { depthOfObject } from '@app/utils';

const getTypeDefs = () => {
  return fileLoader(path.join(__dirname, 'typeDefs/*.graphql'));
};

const getQueries = () => {
  const loadedQueries = fileLoader(path.join(__dirname, 'queries/**/*.ts'));
  return loadedQueries.map(query => {
    /*
      Note:
      This function is a utility for the merging process of resolvers.
      https://github.com/okgrow/merge-graphql-schemas#merging-resolvers

      Intention of this function is to remove the process of repeatedly wrapping
      the method implementation to a parent property named Query.
      From:
        export default {
          Query: {
            your_method
          }
        }
      To:
        export default {
          your_method
        }

      We get the object depth to determine if the query object
      is a parent Query (depth 1) or a field resolver (depth 2).

      If it's a parent query (queries that are extending type Query),
      we wrap the query object in a "Query" property.
        - Implementation example of a parent query:
          export default {
            user
          }

      Else, we return the query directly because it must be a field resolver
      and the parent Type of the field resolver is defined in the respective file.
        - Implementation example of a type field resolver:
          export default {
            User: {
              fullName
            }
          }
    */

    const objectDepth = depthOfObject(query);

    switch (objectDepth) {
      case 1:
        // Query object is extending type Query
        return { Query: query };

      case 2:
        // Query object is a field resolver
        return query;

      default:
        throw new Error('Query object cannot have a depth of other than 1 or 2.');
    }
  });
};

const getMutations = () => {
  const loadedMutations = fileLoader(path.join(__dirname, 'mutations/**/*.ts'));
  return loadedMutations.map(mutation => ({ Mutation: mutation }));
};

const queries = getQueries();
const mutations = getMutations();

// Create schema
let resolvers = mergeResolvers([...queries, ...mutations]);
resolvers = {
  ...enums,
  ...scalars,
  ...resolvers,
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
