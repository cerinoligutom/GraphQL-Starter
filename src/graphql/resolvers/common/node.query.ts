import { GQL_QueryResolvers } from 'graphql-resolvers';

export const nodeResolver: GQL_QueryResolvers['node'] = async (parent, { id }, { loaders }, info) => {
  const user = await loaders.userById.load(id);
  if (user) {
    return user;
  }

  return null;
};
