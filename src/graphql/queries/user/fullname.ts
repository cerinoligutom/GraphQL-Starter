import { UserResolvers } from 'graphql-resolvers';

const fullName: UserResolvers['fullName'] = async parent => {
  const name = [parent.firstName, parent.middleName, parent.lastName]
    .map(x => (x ? x.trim() : ''))
    .filter(x => x.trim())
    .join(' ');

  return name;
};

export default {
  User: {
    fullName,
  },
};
