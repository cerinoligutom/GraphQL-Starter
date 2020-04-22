import { GQL_QueryResolvers, GQL_ResolversParentTypes, Maybe, GQL_User } from 'graphql-resolvers';
import { ExcludeMaybe } from '@app/core/types/ExcludeMaybe';
import { FieldNode, InlineFragmentNode } from 'graphql';
import { User as DB_User } from '@app/db/models';

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

type ValidNodeType = ExcludeMaybe<GQL_ResolversParentTypes['Node']['__typename']>;
function getNodeType(fieldNode: Maybe<FieldNode>): ValidNodeType | null {
  if (!fieldNode?.selectionSet) {
    return null;
  }

  const selection = fieldNode.selectionSet.selections.find((x) => x.kind === 'InlineFragment');
  if (!selection) {
    return null;
  }

  const inlineFragmentNode = selection as InlineFragmentNode;
  if (!inlineFragmentNode.typeCondition) {
    return null;
  }

  return inlineFragmentNode.typeCondition.name.value as ValidNodeType;
}
