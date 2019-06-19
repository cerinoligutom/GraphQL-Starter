import { QueryResolvers } from 'graphql-resolvers';

export const node: QueryResolvers['node'] = async (parent, { id }, { loaders }, info) => {
  const user = await loaders.userById.load(id);
  if (user) {
    return user;
  }

  return null;
};
