import { GQL_QueryResolvers, Maybe, GQL_User } from 'graphql-resolvers';
import { User as DB_User } from '@app/db/models';
import { getNodeType } from '@app/utils';

type User = GQL_User & DB_User;

export const nodeResolver: GQL_QueryResolvers['node'] = async (parent, { id }, { loaders }, info) => {
  const nodeType = getNodeType(info.fieldNodes[0]);

  switch (nodeType) {
    case 'User':
      const user = (await loaders.userById.load(id)) as Maybe<User>;
      if (user) {
        // Make sure to set __typename here so that the __resolveType function
        // will use that value as the discriminant and you won't have to touch/guess
        // what GraphQL type to return at the `node.interface.ts` file.
        user.__typename = 'User';
      }
      return user;

    default:
      return null;
  }
};
