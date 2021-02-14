import { GQL_QueryResolvers } from '@/generated/graphql';
import { getNodeType } from '@/utils';
import { createGQL_User } from '@/core/factories/graphql';

export const nodeResolver: GQL_QueryResolvers['node'] = async (parent, { id }, { loaders }, info) => {
  const nodeType = getNodeType(info.fieldNodes[0]);

  switch (nodeType) {
    case 'User': {
      const user = await loaders.userById.load(id);
      if (user) {
        const gqlUser = createGQL_User(user);
        // Make sure to set __typename here so that the __resolveType function
        // will use that value as the discriminant and you won't have to touch/guess
        // what GraphQL type to return at the `node.interface.ts` file.
        gqlUser.__typename = 'User';
      }
      return user;
    }
    default:
      return null;
  }
};
