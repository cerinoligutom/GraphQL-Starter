import { UserResolvers } from 'graphql-resolvers';

export const fullName: UserResolvers['fullName'] = async parent => {
  const name = [parent.firstName, parent.middleName, parent.lastName]
    .map(x => (x ? x.trim() : ''))
    .filter(x => x.trim())
    .join(' ');

  return name;
};
